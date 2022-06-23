const mongoose = require("mongoose");
const Config = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	pic: {
		type: String,
		required: true,
		default:
			"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
	},
	isAdmin: {
		type: Boolean,
		required: true,
		default: false,
	},
});

userSchema.pre("save", async function (next) {
	// if password is not modified, skip this function
	if (this.isModified("password")) {
		// hash the password before saving
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

userSchema.methods.comparePassword = async function (password) {
	// compare the password with the hashed password
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
	// generate a token for the user
	return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

const userModel = mongoose.model(Config.collection_names.User, userSchema);

module.exports = userModel;
