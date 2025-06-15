import { Router } from "express";
import passport from "passport";
const router = Router();

import {
	logonShow,
	registerShow,
	registerDo,
	logoff,
} from "../controllers/sessionController.ts";

router.route("/register").get(registerShow).post(registerDo);
router
	.route("/logon")
	.get(logonShow)
	.post(
		passport.authenticate("local", {
			successRedirect: "/",
			failureRedirect: "/sessions/logon",
			failureFlash: true,
		}),
	);
router.route("/logoff").post(logoff);

export default router;
