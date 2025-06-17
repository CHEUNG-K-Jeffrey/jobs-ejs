import { Router } from "express";

import {
	jobsGet,
	jobsPost,
	jobsNew,
	jobsEdit,
	jobsUpdate,
	jobsDelete,
} from "../controllers/jobs.ts";

const router = Router();

router.route("/").get(jobsGet).post(jobsPost);
router.route("/new").get(jobsNew);
router.route("/edit/:id").get(jobsEdit);
router.route("/update/:id").post(jobsUpdate);
router.route("/delete/:id").post(jobsDelete);
export default router;
