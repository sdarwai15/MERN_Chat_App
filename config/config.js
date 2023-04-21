const mongoose = require("mongoose");

const Config = {
	api_version: "0.0.1",
	collection_names: {
		User: "Users",
		Message: "Messages",
		Chat: "Chats",
	},
};

module.exports = Config;
