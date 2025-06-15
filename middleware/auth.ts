import type { NextFunction, Response } from "express";
import type { FlashRequest } from "../types.ts";
import csrf from "host-csrf";

const authMiddleware = (
	req: FlashRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = csrf.refresh(req, res);
	if (!req.user) {
		req.flash("error", "You can't access that page before logon.");
		res.redirect("/");
	} else {
		next();
	}
};

export default authMiddleware;
