const mongoose = require("mongoose");

exports.connectDatabase = () => {
	mongoose
		.connect(process.env.MONGO_URI)
		.then((con) =>
			console.log(
				"Connected to Database! on " +
					con.connection.host +
					" at port " +
					con.connection.port
			)
		)
		.catch((err) => console.log("Connection to Database failed", err));
};
