import express from "express";

const app = express();

import "dotenv/config"; // to load the .env file into the process.env object
import session from "express-session";
import bodyParser from "body-parser";
import connectMongodbSession from "connect-mongodb-session";
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

if (app.get("env") === "production") {
	app.set("trust proxy", 1); // trust first proxy
	sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionParms));

import connectFlash from "connect-flash";
app.use(connectFlash());

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// let secretWord = "syzygy"; <-- comment this out or remove this line
app.get("/secretWord", (req, res) => {
	if (!req.session.secretWord) {
		req.session.secretWord = "syzygy";
	}
	res.locals.info = req.flash("info");
	res.locals.errors = req.flash("error");
	res.render("secretWord", { secretWord: req.session.secretWord });
});
app.post("/secretWord", (req, res) => {
	if (req.body.secretWord.toUpperCase()[0] === "P") {
		req.flash("error", "That word won't work!");
		req.flash("error", "You can't use words that start with p.");
	} else {
		req.session.secretWord = req.body.secretWord;
		req.flash("info", "The secret word was changed.");
	}
	res.redirect("/secretWord");
});

app.use((req, res) => {
	res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
	res.status(500).send(err.message);
	console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`),
		);
	} catch (error) {
		console.log(error);
	}
};

start();
