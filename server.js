const app = require("./app");
const { connectDatabase } = require("./config/database");

connectDatabase();

const server = app.listen(process.env.PORT || 4000, () => {
	console.log(`Server is running on port ${process.env.PORT || 4000}`);
});

const io = require("socket.io")(server, {
	pingTimeout: 60000,
	cors: {
		origin: "https://chit-chat-sula.onrender.com",
	},
});

io.on("connection", (socket) => {
	console.log("User connected with socket id: ", socket.id);

	socket.on("setup", (userData) => {
		socket.join(userData._id);
		socket.emit("connected");
	});

	socket.on("join chat", (room) => {
		socket.join(room);
		console.log(`User ${socket.id} joined chat ${room}`);
	});

	socket.on("typing", (room) => socket.in(room).emit("typing"));
	
	socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

	socket.on("new message", (newMessageReceived) => {
		let chat = newMessageReceived.chat;

		if (!chat.users) return console.log("chat.users is not defined");

		chat.users.forEach((user) => {
			if (user._id == newMessageReceived.sender._id) return;

			socket.in(user._id).emit("new message received", newMessageReceived);
		});
	});

	socket.off("setup", () => {
		socket.leave(userData._id);
		console.log("User Disconnected");
	});
});
