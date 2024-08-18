const dotenv = require("dotenv");
const express = require("express");
// const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cron = require("node-cron");

dotenv.config({ path: "backend/config/config.env" });

const user = require("./routes/userRoutes");
const batch = require("./routes/batchRoutes");
const course = require("./routes/courseRoutes");
const student = require("./routes/studentRoutes");
const classDetails = require("./routes/classRoutes");
const notification = require("./routes/noifiactionRoutes");
const permission = require("./routes/permissionRoutes");

const errorMiddleware = require("./middleware/error");
const {
  birthdayNotification,
} = require("./controllers/notifiactionController");

app.use(express.json({ limit: "1.5mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/api/v1", user);
app.use("/api/v1", batch);
app.use("/api/v1", course);
app.use("/api/v1", student);
app.use("/api/v1", classDetails);
app.use("/api/v1", notification);
app.use("/api/v1", permission);

// app.use(express.static(path.join(__dirname, "../frontend/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

cron.schedule(
  "0 0 * * *",
  () => {
    birthdayNotification();
  },
  {
    timezone: "Asia/Dhaka",
  }
);

app.use(errorMiddleware);

module.exports = app;
