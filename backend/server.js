import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
// const cookieParser = require("cookie-parser");

import registerRoutes from "./routes/loader.js";

import { errorHandler } from './middlewares/error.middleware.js';
import { apiLimiter } from './middlewares/rate-limit.middleware.js';
import { httpLogger } from './middlewares/logger.middleware.js';

import { logger } from './utils/logger.js';
import AppError from './utils/app-error.js';

import { env } from "./config.js";

const port = env.PORT || 8080;
const app = express();

// express app settings
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet()); // Protects against common HTTP vulnerabilities.

// need to be used when deploying
// app.use(cors({
//     origin: env.FRONTEND_URL || 'http://localhost:5173/',
//     credentials: true,
// }));

app.use(compression()); // compresses response if threshold passed

app.use(httpLogger);

app.use("/api", apiLimiter); // rate limit - 100 request every 15 min

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());


// Routes
app.use((req, res, next) => {
    console.log("Request path:", req.originalUrl);
    next();
});

app.get(['/', '/api'], (req,res) => {
  res.json({message: "App is running"});
})

await registerRoutes(app);

app.use((req, res, next) => {
  next(new AppError(404, "Route not found"));
});


// serve react build, when backend serving frontend
// app.use(express.static(path.join(__dirname, "dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });


// // Global Error handling middleware
app.use(errorHandler);


async function startServer() {
  try {
    app.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
      // console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server: ', error.message);
    // console.error('Failed to start server: ', error.message);
    process.exit(1);
  }
}

await startServer();