const mongoose = require("mongoose");
const Config = require("../config/config");

const chatSchema = mongoose.Schema({
	chatName: { type: String, trim: true },
	isGroupChat: { type: Boolean, default: false },
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: Config.collection_names.User,
		},
	],
	latestMessage: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Config.collection_names.Message,
	},
	groupAdmin: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Config.collection_names.User,
	},
});

const ChatModel = mongoose.model(Config.collection_names.Chat, chatSchema);

module.exports = ChatModel;
