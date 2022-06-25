const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	removeFromGroup,
	addToGroup,
} = require("../controllers/ChatController");

/**
 * @desc access chat
 * @route POST /chat
 * @access Private
 **/

router.route("/").post(isAuthenticated, accessChat);

/**
 * @desc fetch chat
 * @route GET /chat
 * @access Private
 **/

router.route("/").get(isAuthenticated, fetchChats);

/**
 * @desc creates a group chat
 * @route POST /chat/group
 * @access Private
 **/

router.route("/group").post(isAuthenticated, createGroupChat);

/**
 * @desc renames a group chat
 * @route PATCH /chat/rename
 * @access Private
 **/

router.route("/rename").patch(isAuthenticated, renameGroup);

/**
 * @desc removes a user from a group chat
 * @route PATCH /chat/groupremove
 * @access Private
 **/

router.route("/groupremove").patch(isAuthenticated, removeFromGroup);

/**
 * @desc adds a user to a group chat
 * @route PATCH /chat/groupadd
 * @access Private
 **/

router.route("/groupadd").patch(isAuthenticated, addToGroup);

module.exports = router;
