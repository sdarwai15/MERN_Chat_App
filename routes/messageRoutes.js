const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const {
	allMessages,
	sendMessage,
} = require("../controllers/MessageController");

/**
 * @desc get all messages
 * @route GET /message/:chatId
 * @access Private
 **/

router.route("/:chatId").get(isAuthenticated, allMessages);

/**
 * @desc sends a message
 * @route POST /message
 * @access Private
 **/

router.route("/").post(isAuthenticated, sendMessage);

module.exports = router;
