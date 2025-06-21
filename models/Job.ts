import { type Model, Schema, Types, model } from "mongoose";

export interface IJob {
	company: string;
	position: string;
	status: string;
	createdBy: string;
}

// biome-ignore lint/suspicious/noEmptyInterface: Stub
interface IJobMethods {}

type JobModel = Model<IJob, unknown, IJobMethods>;

const JobSchema = new Schema(
	{
		company: {
			type: String,
			required: [true, "Please provide company name"],
			maxlength: 50,
		},
		position: {
			type: String,
			required: [true, "Please provide position"],
			maxlength: 100,
		},
		status: {
			type: String,
			enum: ["interview", "declined", "pending"],
			default: "pending",
		},
		createdBy: {
			type: Types.ObjectId,
			ref: "User",
			required: [true, "Please provide user"],
		},
	},
	{ timestamps: true },
);

export default model<IJob, JobModel>("Job", JobSchema);
