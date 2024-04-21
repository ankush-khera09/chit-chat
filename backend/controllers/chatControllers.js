const asyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// create or fetch one-on-one chat
const accessChat = asyncHandler(
    async(req, res) => {
        // current user will send userId of the user with which he wants to chat
        // if a chat with that userId exists => access that chat, otherwise create a new one
        const { userId } = req.body;

        if(!userId){
            console.log("UserId param was not sent with request!")
            return res.status(400);
        }

        var isChat = await Chat.find(
            {
                // this is one-on-one chat, it should not be a group chat
                isGroupChat: false,
                // 'users' array in the chatModel should contain both users in chat
                // give that chat which contains both users
                $and: [
                    { users: { $elemMatch: { $eq: req.user._id } } },
                    { users: { $elemMatch: { $eq: userId } } },
                ],
            }
        ).populate("users", "-password").populate("latestMessage");
        // chatModel me 'users' array ko saari info ke saath populate krdo except password
        // also the latestMessage

        // 'sender' field in latestMessage has to be populated also
        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email"
        });

        // if this chat exists => return it
        if(isChat.length > 0){
            // there will always be only one entry in this isChat array
            res.send(isChat[0]);
        }else{
            // create a new chat
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            try {
                const createdChat = await Chat.create(chatData);
                const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");

                res.status(200).send(fullChat);
            } catch (error) {
                res.status(400);
                throw new Error(error.message);
            }
        }
    }
);

const fetchChats = asyncHandler(
    async(req, res) => {
        try{
            Chat.find({users: { $elemMatch: {$eq: req.user._id} }})
                .populate("users", "-password")
                .populate("groupAdmin", "-password")
                .populate("latestMessage")
                    .sort( {updatedAt: -1} )      // sort from new to old chat
                  .then(async(results) => {
                    results = await User.populate(results, {
                        path: "latestMessage.sender",
                        select: "name pic email", 
                    });
                    res.status(200).send(results);
                  });
        }catch(error){
            res.status(400);
            throw new Error(error.message);
        }
    }
)

module.exports = { accessChat, fetchChats };