var express = require("express");
const { checkAuthentication } = require("../utilities/utility");
var router = express.Router();

router.post("/history", checkAuthentication, function (req, res, next) {});

router.post("/schedule", function (req, res, next) {});

router.post("/start", function (req, res, next) {});

router.post("/end", function (req, res, next) {});

module.exports = router;
