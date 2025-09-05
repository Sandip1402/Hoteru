const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const expressError = require("./utils/expressError.js");
const config = require("./config.js");
const port = config.port;
const registerApis = require("./apis/index.js");

const app = express();

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



app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// APIs
registerApis(app);


// error handler
app.use((req, res, next) => {
    next(new expressError(404, "Page Not found"));
})


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: "Something went wrong on the server",
    });
})


app.listen(port, () => {
    console.log(`app listening on ${port} port`);
})