const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");

module.exports = {
	async allMessages(req, res, next) {
		try {
			const { chatId } = req.params;

			if (!chatId) {
				return res.status(400).json({
					success: false,
					errorCode: 400,
					field: "chatId",
					message: "Please enter chatId",
				});
			}

			const messages = await Message.find({ chat: chatId }).populate("sender");

			res.status(200).json({ success: true, messages });
		} catch (error) {
			next(error);
		}
	},

	async sendMessage(req, res, next) {
		const { content, chatId } = req.body;

		if (!content || !chatId) {
            return res.status(400).json({
                success: false,
                errorCode: 400,
                field: "content or chatId",
                message: "Please enter content and chatId",
            });
		}

		var newMessage = {
			sender: req.user._id,
			content: content,
			chat: chatId,
		};

		try {
			var message = await Message.create(newMessage);

			message = await message.populate("sender", "name pic")
			message = await message.populate("chat")
			message = await User.populate(message, {
				path: "chat.users",
				select: "name pic email",
			});

			await Chat.findByIdAndUpdate(req.body.chatId, {
				latestMessage: message,
			});

			res.json(message);
		} catch (error) {
			next(error);
		}
	},
};
