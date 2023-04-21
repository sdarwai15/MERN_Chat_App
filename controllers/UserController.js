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

	async login(req, res, next) {
		try {
			const { email, password } = req.body;

			// find user by email and select password
			const foundUser = await userModel.findOne({ email }).select("+password");

			if (!foundUser) {
				res.status(404).json({
					success: false,
					errorCode: 404,
					field: "User does not exist",
				});
			}

			// check if password is correct
			const isMatch = await foundUser.comparePassword(password);

			if (!isMatch) {
				res.status(401).json({
					success: false,
					errorCode: 401,
					message: "Invalid email or password",
				});
			}

			// generate token
			const token = await foundUser.generateAuthToken();

			//setting options for token
			const options = {
				expires: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};

			// sending response with token and user data
			res
				.status(200)
				.cookie("token", token, options)
				.json({ success: true, foundUser, token });
		} catch (error) {
			next(error);
		}
	},

	async logout(req, res, next) {
		try {
			res
				.status(200)
				.cookie("token", null, {
					expires: new Date(Date.now()),
					httpOnly: true,
				})
				.json({ success: true, message: "Logged out successfully" });
		} catch (error) {
			next(error);
		}
	},

	async allUsers(req, res, next) {
        try {
            
            const keyword = req.query.search
							? {
									$or: [
										{ name: { $regex: req.query.search, $options: "i" } },
										{ email: { $regex: req.query.search, $options: "i" } },
									],
							  }
							: {};

			const users = await userModel
				.find(keyword)
                .find({ _id: { $ne: req.user._id } });
            
			res.status(200).json({ success: true, users });
		} catch (error) {
			next(error);
		}
	},
};
