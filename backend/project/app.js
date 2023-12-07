var path = require("path");
var express = require("express");
const cors = require("cors");
var cookieParser = require("cookie-parser");
var { transports } = require("winston");
var expressWinston = require("express-winston");

var userRouter = require("./routes/user");
var ridesRouter = require("./routes/ride");
var indexRouter = require("./routes/index");
var googleRouter = require("./routes/google");

var app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", userRouter);
app.use("/ride", ridesRouter);
app.use("/google/", googleRouter);

module.exports = app;
