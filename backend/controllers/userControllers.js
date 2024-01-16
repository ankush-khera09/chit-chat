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

module.exports = {signUp, login};