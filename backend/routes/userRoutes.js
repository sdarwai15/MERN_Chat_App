const express = require("express");
const router = express.Router();
const { api_version } = require("../config/config");
const { isAuthenticated } = require("../middlewares/auth");
const { register, login, logout, allUsers } = require("../controllers/UserController");

/**
 * @desc Opens the api documentation page
 * @route GET /user/api_version
 * @access Public
 **/

router.route("/api_ver").get(async (req, res) => {
	res.send(`here is response for you Api version ${api_version}`);
});

/**
 * @desc registers a new user
 * @route POST /user/register
 * @access Public
 **/

router.route("/register").post(register);

/**
 * @desc login a user
 * @route POST /user/login
 * @access Public
 **/

router.route("/login").post(login);

/**
 * @desc logout a user
 * @route GET /user/logout
 * @access Public
 **/

router.route("/logout").get(isAuthenticated, logout);

/**
 * @desc fetches user throught search
 * @route GET /user
 * @access Private
 **/

router.route("/").get(isAuthenticated, allUsers);

module.exports = router;
