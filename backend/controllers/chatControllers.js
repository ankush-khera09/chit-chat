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
);

const createGroupChat = asyncHandler(
    // we need users and chat name to create a group chat
    async(req, res) => {
        if(!req.body.users || !req.body.name){
            return res.status(400).send({message: "Please fill all the fields!"});
        }

        var users = JSON.parse(req.body.users);

        if(users.length < 2){
            return res.status(400).send("More than 2 users are required to form a group chat!");
        }

        users.push(req.user);        // to include current logged in user in group chat

        try{
            const groupChat = await Chat.create({
                chatName: req.body.name,
                users: users,
                isGroupChat: true,
                groupAdmin: req.user,
            });

            const fullGroupChat = await Chat.findOne({_id: groupChat._id})
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
                
                res.status(200).json(fullGroupChat);
        }catch(error){
            res.status(400);
            throw new Error(error.message);
        }
    }
);

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
  
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
});

const addToGroup = asyncHandler(
    async(req, res) => {
        const { chatId, userId } = req.body;

        const userAdded = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: {users: userId},
            },
            {
                new: true,
            }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        if(!userAdded){
            res.status(404);
            throw new Error("Chat Not Found!");
        }else{
            res.json(userAdded);
        }
    }
);

const removeFromGroup = asyncHandler(
    async(req, res) => {
        const { chatId, userId } = req.body;

        const userRemoved = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: {users: userId},
            },
            {
                new: true,
            }
        ).populate("users", "-password").populate("groupAdmin", "-password");

        if(!userRemoved){
            res.status(404);
            throw new Error("Chat Not Found!");
        }else{
            res.json(userRemoved);
        }
    }
)

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup };