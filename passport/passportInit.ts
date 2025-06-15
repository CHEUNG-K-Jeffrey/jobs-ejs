import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User";
import type { User as UserRequest } from "../types.ts";

const passportInit = () => {
	passport.use(
		"local",
		new LocalStrategy(
			{ usernameField: "email", passwordField: "password" },
			async (email, password, done) => {
				try {
					const user = await User.findOne({ email: email });
					if (!user) {
						return done(null, false, { message: "Incorrect credentials." });
					}

					const result = await user.comparePassword(password);
					if (result) {
						return done(null, user);
					}
					return done(null, false, { message: "Incorrect credentials." });
				} catch (e) {
					return done(e);
				}
			},
		),
	);

	passport.serializeUser(async (user: UserRequest, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			if (!user) {
				return done(new Error("user not found"));
			}
			return done(null, user);
		} catch (e) {
			done(e);
		}
	});
};

export default passportInit;
