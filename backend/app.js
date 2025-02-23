const dotenv = require("dotenv");
const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cron = require("node-cron");

dotenv.config({ path: "./config/config.env" });

const user = require("./routes/userRoutes");
const batch = require("./routes/batchRoutes");
const course = require("./routes/courseRoutes");
const student = require("./routes/studentRoutes");
const classDetails = require("./routes/classRoutes");
const notification = require("./routes/notificationRoutes");
const permission = require("./routes/permissionRoutes");
const exam = require("./routes/examRoutes");
const otp = require("./routes/otpRoutes");

const errorMiddleware = require("./middleware/error");
const { birthdayNotification } = require("./controllers/notificationController");

const app = express();

// Global Middleware
app.use(express.json({ limit: "1.5mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// CORS Configuration
// This setup handles CORS preflight requests manually
// CORS Configuration using cors middleware
const corsOptions = {
  origin: ["https://sciencetent.vercel.app", "http://localhost:3000","http://192.168.0.122:3000"],
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization", "cookie"],
  credentials: true,
};

app.use(cors(corsOptions));


// Route Handlers
app.get('/', (req, res) => {
  res.status(404).json({ message: "This is an API server. Please use the appropriate endpoints." });
});

app.use("/api/v1", user);
app.use("/api/v1", batch);
app.use("/api/v1", course);
app.use("/api/v1", student);
app.use("/api/v1", classDetails);
app.use("/api/v1", notification);
app.use("/api/v1", permission);
app.use("/api/v1", exam);
app.use("/api/v1", otp);


// Error Middleware
app.use(errorMiddleware);

// Schedule Tasks
// cron.schedule(
//   "0 0 * * *",
//   () => {
//     birthdayNotification();
//   },
//   {
//     timezone: "Asia/Dhaka",
//   }
// );

module.exports = app;
