const express = require("express");
// const cookieParser = require("cookie-parser");
const { prismaClient } = require("@prisma/client");

const expressError = require("./utils/expressError.js");
const registerRoutes = require("./routes/connect_routes.js");

const port = process.env.port || 8080;
const app = express();
const prisma = new prismaClient();

// express settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());


// serve react build
// app.use(express.static(path.join(__dirname, "dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });


// Routes
registerRoutes(app, prisma);

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

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
}

startServer();