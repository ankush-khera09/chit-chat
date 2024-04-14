// This package checks async related errors
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const signUp = asyncHandler(
    async(req, res)=>{
        const {name, email, password, pic} = req.body;
        
        // if anything is not defined, throw an error
        if(!name || !email || !password){
            return res.status(400).json({error: "Please enter all fields!"});
        }

        // check if the user already exists
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({ error: "User with this email already exists!" });
        }
        // creating a new user
        const user = await User.create({name, email, password, pic});
        if(user){
            return res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            });
        }else{
            return res.status(400).json({error: "Failed to create the user!"});
        }
    }
);

const login = asyncHandler(
    async(req, res)=>{
        const { email, password } = req.body;

        const user = await User.findOne({email});

        if(user && (await user.matchPassword(password))){
            return res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            });
        }else{
            return res.status(401).json({error: "Invalid email or password!"});
        }
    }
);

// Find Users
// "/api/user?search=ankush"
const allUsers = asyncHandler(
    async(req, res) => {
        // agr koi query hai => We'll search the user in name and email
        const keyword = req.query.search ? {
            // The $or operator performs a logical OR operation on an array of one or more <expressions>
            // and selects the documents that satisfy at least one of the <expressions>.
            // here, we will check into name and email fields.
            $or: [
                // $regex provides regular expression capabilities for pattern matching strings in queries.
                // "i" is for case insensitivity
                {name: { $regex: req.query.search, $options: "i" }},
                {email: { $regex: req.query.search, $options: "i" }}
            ]
        } : {};  // don't do anything in case of no query

        // except this current logged in user, return all users which are part of this search
        // $ne means not equals
        // we can get this req.user._id only after authorization of user - he must be logged in
        const users = await User.find(keyword).find({_id: {$ne: req.user._id}});
        res.send(users);
    }
);

// Steps to check this search user (except the logged in) functionality in Postman:
// 1. First Login & take token
// 2. Go to the allUsers API and under authorization, select 'Bearer Token' & put this token value there
// 3. Now hit this API and this will work

module.exports = {signUp, login, allUsers};