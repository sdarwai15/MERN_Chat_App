const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

// if not in production, set dotenv to load .env file
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config({ path: "backend/config/config.env" });
}

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
	});
}

//Using middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Importing routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

//Using routes
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

module.exports = app;
