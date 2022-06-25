const mongoose = require("mongoose");
const Config = require("../config/config");

const messageSchema = mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Config.collection_names.User,
	},
	content: { type: String, trim: true },
	chat: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Config.collection_names.Chat,
	},
	readBy: [
		{ type: mongoose.Schema.Types.ObjectId, ref: Config.collection_names.User },
	],
});

const MessageModel = mongoose.model(
	Config.collection_names.Message,
	messageSchema
);
module.exports = MessageModel;
