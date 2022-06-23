const express = require("express");
const router = express.Router();
const { api_version } = require("../config/config");
const { register } = require("../controllers/UserController");

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

module.exports = router;
