const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { accessChat, fetchChats } = require("../controllers/chatControllers");

const router = express.Router();

// for accessing or creating a chat
router.route('/').post(protect, accessChat);
// // fetch all chats for the user
router.route('/').get(protect, fetchChats);

// router.route('/group').post(protect, createGroupChat);
// router.route('/rename').put(protect, renameGroup);
// router.route('/groupremove').put(protect, removeFromGroup);
// router.route('/groupadd').put(protect, addToGroup);

module.exports = router;