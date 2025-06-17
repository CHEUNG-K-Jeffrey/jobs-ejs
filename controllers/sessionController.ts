import type { NextFunction, Request, Response } from "express";
import User from "../models/User.ts";
import parseVErr from "../util/parseValidationErrs.ts";
import type { FlashRequest, SessionRequest } from "../types.ts";

const registerShow = (req: Request, res: Response) => {
	res.render("register");
};

const registerDo = async (
	req: FlashRequest,
	res: Response,
	next: NextFunction,
) => {
	if (!req.body?.password || !req.body?.password1) {
		req.flash("error", "The passwords are empty.");
		return res.render("register");
	}
	if (req.body.password !== req.body.password1) {
		req.flash("error", "The passwords entered do not match.");
		return res.render("register");
	}
	try {
		await new User(req.body).save();
	} catch (e) {
		if (e.constructor.name === "ValidationError") {
			parseVErr(e, req);
		} else if (e.name === "MongoServerError" && e.code === 11000) {
			req.flash("error", "That email address is already registered.");
		} else {
			return next(e);
		}
		console.log("Error");
		return res.render("register");
	}

	res.render("index");
};

const logoff = (req: SessionRequest, res: Response) => {
	req.session.destroy((err: Error) => {
		if (err) {
			console.log(err);
		}
		res.redirect("/");
	});
};

const logonShow = (req: Request, res: Response) => {
	if (req.user) {
		req.flash("YOu logged in");
		return res.render("index");
	}
	return res.render("logon");
};

export { registerShow, registerDo, logoff, logonShow };
