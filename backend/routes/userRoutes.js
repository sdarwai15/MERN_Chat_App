const express = require("express");
const router = express.Router();
const { api_version } = require("../config/config");
const { isAuthenticated } = require("../middlewares/auth");
const { register, login, logout } = require("../controllers/UserController");

/**
 * @desc Opens the api documentation page
 * @route GET /posts/api_version
 * @access Public
 **/

router.route("/api_ver").get(async (req, res) => {
	res.send(`here is response for you Api version ${api_version}`);
});

/**
 * @desc registers a new user
 * @route POST /api/v1/register
 * @access Public
 **/

router.route("/register").post(register);

/**
 * @desc login a user
 * @route POST /api/v1/login
 * @access Public
 **/

router.route("/login").post(login);

/**
 * @desc logout a user
 * @route GET /api/v1/logout
 * @access Public
 **/

router.route("/logout").get(isAuthenticated, logout);

module.exports = router;
