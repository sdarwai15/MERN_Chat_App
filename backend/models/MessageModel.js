const mongoose = require("mongoose");
const Config = require("../config/config");

const messageSchema = mongoose.Schema(
	{
		sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		content: { type: String, trim: true },
		chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
		readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

const MessageModel = mongoose.model(
	Config.collection_names.Message,
	messageSchema
);
module.exports = MessageModel;
