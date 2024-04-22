const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatControllers");

const router = express.Router();

// for accessing or creating a chat
router.route('/').post(protect, accessChat);
// // fetch all chats for the user
router.route('/').get(protect, fetchChats);

router.route('/group').post(protect, createGroupChat);
router.route('/rename-group').put(protect, renameGroup);
router.route('/add-user-to-group').put(protect, addToGroup);
router.route('/remove-user-from-group').put(protect, removeFromGroup);

module.exports = router;