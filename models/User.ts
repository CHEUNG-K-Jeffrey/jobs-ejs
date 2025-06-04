import { type Model, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type ms from "ms";

interface IUser {
	name: string;
	email: string;
	password: string;
}

interface IUserMethods {
	createJWT(): unknown;
	comparePassword(password: string): Promise<boolean>;
}

type UserModel = Model<IUser, unknown, IUserMethods>;

const UserSchema = new Schema<IUser>({
	name: {
		type: String,
		required: [true, "Please provide name"],
		maxlength: 50,
		minlength: 3,
	},
	email: {
		type: String,
		required: [true, "Please provide email"],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please provide a valid email",
		],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please provide password"],
		minlength: 6,
	},
});

UserSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
	return jwt.sign(
		{ userId: this._id, name: this.name },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_LIFETIME as ms.StringValue,
		},
	);
};

UserSchema.methods.comparePassword = async function (
	candidatePassword: string,
) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password);
	return isMatch;
};

export default model<IUser, UserModel>("User", UserSchema);
