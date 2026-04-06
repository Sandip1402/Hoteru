const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const expressError = require("./utils/expressError.js");
const config = require("./config.js");
const registerApis = require("./apis/index.js");

const port = process.env.port || 8080
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


// express settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// serve react build
// app.use(express.static(path.join(__dirname, "dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });


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


// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
  
//   const status = err.status || 500;
//   const message = err.message || 'Internal Server Error';
  
//   res.status(status).json({
//     error: err.code || 'server_error',
//     message: status === 401 ? 'Authentication required' : message,
//   });
// });

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});