const userModel = require("../models/UserModel");

module.exports = {
	async register(req, res, next) {
		try {
			const { name, email, pic, password, isAdmin } = req.body;

			// check if user has given all required fields
			if (!name || !email || !password) {
				res.status(400);
                throw new Error("Please Enter all the mandatory Feilds");
			}

			// check if user already exists
			const foundUser = await userModel.findOne({ email });
			if (foundUser) {
				res.status(409).json({
					success: false,
					errorCode: 409,
					field: "email",
					message: `User already exists with ${email} id`,
				});
			} else {
				// create new user if not found in db

				const newUser = new userModel({
					name,
					email,
					password,
					pic,
				});

				const ans = await newUser.save();

				// generate token
				const token = await ans.generateAuthToken();

				//setting options for token
				const options = {
					expires: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
					httpOnly: true,
				};

				// sending response with token and user data
				res
					.status(201)
					.cookie("token", token, options)
					.json({ success: true, ans, token });
			}
		} catch (error) {
			next(error);
		}
	},
};
