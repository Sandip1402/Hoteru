import express from 'express';
// const cookieParser = require("cookie-parser");

import expressError from "./utils/expressError.js";
import registerRoutes from "./routes/connect_routes.js";
import { prisma } from "./utils/prisma.js";
import '@dotenvx/dotenvx/config'

const port = process.env.port || 8080;
const app = express();

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


app.get('/', (req,res) => {
  res.json({message: "App is running"});
})


// // Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    error: err.code || 'server_error',
    message: status === 401 ? 'Authentication required' : message,
  });
});


async function startServer() {
  try {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}/`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
}

startServer();