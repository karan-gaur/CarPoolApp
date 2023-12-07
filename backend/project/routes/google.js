const axios = require("axios");
const express = require("express");
const router = express.Router();

const { checkAuthentication, getLocation } = require("../utilities/utility");

router.get("/location", checkAuthentication, async function (req, res, next) {
    return res.status(200).json({ location: await getLocation(req.query.place_id) });
});

module.exports = router;
