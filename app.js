const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const expressError = require("./utils/expressError.js");
const config = require("./config.js");


const app = express();
const port = config.port;


const registerApis = require("./apis");


// connect to database
const MONGO_URL = config.dbUrl;
async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
    console.log("error connecting to database");
})


// ejs & views setting
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));






// APIs
registerApis(app);


// error handler
app.use((req, res, next) => {
    next(new expressError(404, "Page Not found"));
})


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something weng wrong" } = err;
    res.status(statusCode).render("layouts/error.ejs", { message });
})


app.listen(port, () => {
    console.log(`app listening on ${port} port`);
})