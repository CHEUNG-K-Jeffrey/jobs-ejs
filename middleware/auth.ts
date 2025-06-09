import type { NextFunction, Response } from "express";
import type { FlashRequest } from "../types.ts";

const authMiddleware = (
	req: FlashRequest,
	res: Response,
	next: NextFunction,
) => {
	if (!req.user) {
		req.flash("error", "You can't access that page before logon.");
		res.redirect("/");
	} else {
		next();
	}
};

export default authMiddleware;
