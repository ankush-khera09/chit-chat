const express = require("express");
const dotenv = require("dotenv");
const {chats} = require("./data");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// cross-origin resource sharing - when frontend and backend are on diff domains
app.use(cors());

dotenv.config();

connectDB();  // connect to mongoDB database

app.get('/', (req, res)=>{
    res.send("API is running fine!");
})

app.get("/api/chats", (req, res)=>{
    res.send(chats);
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on Port ${PORT}!`));