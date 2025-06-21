import express, {
	type NextFunction,
	type Request,
	type RequestHandler,
	type Response,
} from "express";
import auth from "./middleware/auth.js";
import secretWordRouter from "./routes/secretWord.js";
import passport from "passport";
import passportInit from "./passport/passportInit.js";
import connectDB from "./db/connect.js";
import "dotenv/config"; // to load the .env file into the process.env object
import session from "express-session";
import bodyParser from "body-parser";
import connectMongodbSession from "connect-mongodb-session";
import connectFlash from "connect-flash";
import storeLocals from "./middleware/storeLocals.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import csrf from "host-csrf";
import cookieParser from "cookie-parser";
import jobsRouter from "./routes/jobs.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import xssClean from "xss-clean";

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
});

const app = express();

app.use(xssClean());

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use(helmet());

const MongoDBStore = connectMongodbSession(session);
const url = process.env.MONGO_URI;

const store = new MongoDBStore({
	// may throw an error, which won't be caught
	uri: url,
	collection: "mySessions",
});
store.on("error", (error) => {
	console.log(error);
});

const sessionParms = {
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	store: store,
	cookie: { secure: false, sameSite: "strict" },
};

app.set("view engine", "ejs");
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(bodyParser.urlencoded({ extended: true }));
let csrf_development_mode = true;
if (app.get("env") === "production") {
	csrf_development_mode = false;
	app.set("trust proxy", 1); // trust first proxy
	sessionParms.cookie.secure = true; // serve secure cookies
}

const csrf_options = {
	protected_operations: ["PATCH"],
	protected_content_types: ["application/json"],
	development_mode: csrf_development_mode,
};
const csrf_middleware = csrf(csrf_options) as RequestHandler; //initialise and return middlware
app.use(csrf_middleware);

app.use(session(sessionParms));

app.use(connectFlash());
app.use(storeLocals);

passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
	res.render("index", { user: req.user });
});

app.use("/jobs", jobsRouter);

app.use("/sessions", sessionRoutes);

// let secretWord = "syzygy"; <-- comment this out or remove this line

app.use("/secretWord", auth, secretWordRouter);

app.use((req, res) => {
	res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	res.status(500).send(err.message);
	console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`),
		);
	} catch (error) {
		console.log(error);
	}
};

start();
