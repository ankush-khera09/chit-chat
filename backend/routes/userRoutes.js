const express = require("express");
const {signUp, login} = require("../controllers/userControllers");

const router = express.Router();

// 2 syntaxes
router.route('/').post(signUp);
router.post('/login', login);

module.exports = router;