import type { Request, Response, NextFunction } from "express";
import Job, { type IJob } from "../models/Job.ts";
import parseVErr from "../util/parseValidationErrs.ts";

const jobsGet = async (req: Request, res: Response, next: NextFunction) => {
	let jobs: IJob[];
	try {
		jobs = await Job.find({ createdBy: req.user._id });
	} catch (e) {
		if (e.constructor.name === "ValidationError") {
			parseVErr(e, req);
		} else {
			return next(e);
		}
		return res.status(400).render("register", { errors: req.flash("errors") });
	}
	res.render("jobs", { info: req.query.info, jobs });
};

const jobsPost = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Job.create({ ...req.body, createdBy: req.user._id });
	} catch (e) {
		if (e.constructor.name === "ValidationError") {
			parseVErr(e, req);
		} else {
			return next(e);
		}
		return res.status(400).render("register", { errors: req.flash("errors") });
	}
	res.redirect("/jobs?info=Added%20New%20Job");
};

const jobsNew = (req, res) => {
	res.render("job", { job: null });
};

const jobsEdit = async (req: Request, res: Response, next: NextFunction) => {
	let job: IJob;
	try {
		job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
	} catch (e) {
		if (e.constructor.name === "ValidationError") {
			parseVErr(e, req);
		} else {
			return next(e);
		}
		return res.status(400).render("register", { errors: req.flash("errors") });
	}
	res.render("job", { job });
};

const jobsUpdate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Job.findOneAndUpdate(
			{ _id: req.params.id, createdBy: req.user._id },
			{ ...req.body },
		);
	} catch (e) {
		if (e.constructor.name === "ValidationError") {
			parseVErr(e, req);
		} else {
			return next(e);
		}
		return res.status(400).render("register", { errors: req.flash("errors") });
	}
	res.redirect("/jobs");
};

const jobsDelete = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Job.deleteOne({ _id: req.params.id, createdBy: req.user._id });
	} catch (e) {
		if (e.constructor.name === "ValidationError") {
			parseVErr(e, req);
		} else {
			return next(e);
		}
		return res.status(400).render("register", { errors: req.flash("errors") });
	}
	res.redirect("/jobs");
};

export { jobsGet, jobsPost, jobsNew, jobsEdit, jobsUpdate, jobsDelete };
