var path = require("path");
var express = require("express");
var cookieParser = require("cookie-parser");
var { transports } = require("winston");
var expressWinston = require("express-winston");

var userRouter = require("./routes/user");
var ridesRouter = require("./routes/ride");
var indexRouter = require("./routes/index");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", userRouter);
app.use("/ride", ridesRouter);

module.exports = app;
