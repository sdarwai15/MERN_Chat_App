const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

module.exports = {
	async isAuthenticated(req, res, next) {
		try {
			const token = req.cookies.token;

			if (!token) {
				// if no token, return error
				res.status(401).json({
					description: "Authorization token is required in headers",
					errors: [
						{
							errorCode: 401,
							field: "Authorization",
							message: "Please Login first",
						},
					],
				});

				return;
			}

			// verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			// if token is valid, find user by id in db
			const user = await UserModel.findById(decoded._id);
			if (!user) {
				// if user not found, return error
				res.status(401).json({
					description: "Authorization token is required in headers",
					errors: [
						{
							errorCode: 401,
							field: "Authorization",
							message: "User not found",
						},
					],
				});

				return;
			}
			// if user found, set user to req.user
			req.user = user;
			next();
		} catch (error) {
			// console.log(error);
			next(error);
		}
	},
};
