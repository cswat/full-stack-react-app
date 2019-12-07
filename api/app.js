//Initial config
const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");
app.use(cors());

// enable error logging across the app
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

const db = require("./db");

const routes = require("./routes/routes");

app.use(express.json());

//testing database connection
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
})();

// sync sequelize tables
db.sequelize.sync();

app.use("/api", routes);

//404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "URL not found"
  });
});

app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

app.set("port", process.env.PORT || 5000);

const server = app.listen(app.get("port"), () => {
  console.log(
    `Express server is listening on localhost:${server.address().port}`
  );
});
