import type { NextFunction, Response } from "express";
import type { FlashRequest } from "../types.ts";

const storeLocals = (req: FlashRequest, res: Response, next: NextFunction) => {
	if (req.user) {
		res.locals.user = req.user;
	} else {
		res.locals.user = null;
	}
	res.locals.info = req.flash("info");
	res.locals.errors = req.flash("error");
	next();
};

export default storeLocals;
