const express = require("express");
const dotenv = require("dotenv");
const {chats} = require("./data");

const app = express();

app.get('/', (req, res)=>{
    res.send("API is running fine!");
})

app.get("/api/chats/:id", (req, res)=>{
    const singleChat = chats.find((chat) => chat._id===req.params.id);
    res.send(singleChat);
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on Port ${PORT}!`));