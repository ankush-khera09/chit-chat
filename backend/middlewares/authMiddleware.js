const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// When we want to search Users, we don't want to see the current user. So, we need to be logged in
// This protect will first run and check if the user is logged in or not by checking the token status
// It has been placed in the userRoutes

const protect = asyncHandler(
    async(req, res, next) => {
        let token;
        
        // if token exists
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            try{
                // token will look like: "Bearer token_value"
                // So, removing Bearer and getting token value
                token = req.headers.authorization.split(" ")[1];

                // decoding token id
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // define a new user var in req object
                // find the user and return it without password
                req.user = await User.findById(decoded.id).select("-password");

                // move on to the next operation
                next();
            }catch(error){
                res.status(401);
                throw new Error("Not authorized, Token failed!");
            }
        }

        if(!token){
            res.status(401);
            throw new Error("Not authorized, No Token!");
        }
    }
);

module.exports = { protect };