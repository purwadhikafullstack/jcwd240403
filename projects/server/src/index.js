require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { join } = require("path");

const routes = require("./routes");
const resetOtpCounterJob = require("./cronJobs/resetOtpCounter");

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors({}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/static", express.static(join(__dirname, "public")));

resetOtpCounterJob();
//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.use("/api/auth", routes.auth);
app.use("/api/category-area", routes.categoryArea);
app.use("/api/profile", routes.profile);

// app.get("/api", (req, res) => {
//   res.send(`Hello, this is my API`);
// });

// app.get("/api/greetings", (req, res, next) => {
//   res.status(200).json({
//     message: "Hello, Student !",
//   });
// });

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
