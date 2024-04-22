require("dotenv").config({ path: "config.env" });
const path = require("path");
const express = require("express");
const cors = require("cors");
const compression = require("compression");

const app = express();
app.use(cors());
app.options("*", cors()); // include before other routes
// compress all responses
app.use(compression());

const port = process.env.PORT || 8000;
const morgan = require("morgan");
const dbConnection = require("./config/dbconnection");
const globalError = require("./middleware/errorMidllware");

const mountRoutes = require("./routes");

dbConnection();

if (process.env.NODE_ENV === "devlopment") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const server = app.listen(port, () => {
  console.log(`Server Started on Port http://localhost:${port}`);
});

// handel rejection outside express
process.on("unhandledRejection", (err) => {
  console.log(`UnhandledRejection Errors ${err}`);
  server.close(() => {
    console.log("shut down..."); //to stop server
    process.exit(1); // to stop run application
  });
});
