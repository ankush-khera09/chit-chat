const express = require("express");
const {signUp, login, allUsers} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// 2 syntaxes
router.route('/').post(signUp).get(protect, allUsers);
router.post('/login', login);

module.exports = router;