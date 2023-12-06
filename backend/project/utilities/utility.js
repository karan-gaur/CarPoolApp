var jwt = require("jsonwebtoken");
var axios = require("axios");

const constants = require("../constants");
const { ACCESS_TOKEN_SECRET_KEY, GOOGLE_API_KEY, client, logger } = require("../config");

function checkAdminAuthentication(req, res, next) {
    if (typeof req.headers["authorization"] !== "undefined") {
        // Validating AUTH token
        const token = req.headers["authorization"].split(" ")[1];
        try {
            req.headers.token = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
            if (!req.headers.token.admin) {
                // No Auth token found
                logger.warn(`Unauthorised access for admin services - ${req.headers.token.username}`);
                return res
                    .status(401)
                    .json({ error: "Unauthorised Access", msg: "Unauthorised Access. Admin privileges required" });
            }
        } catch (err) {
            logger.error(`Error validating JWT from request. Err - ${err}`);
            return res
                .status(401)
                .json({ error: "Unauthorised Access", msg: "JWT Token unauthorised - reissue required." });
        }
        next();
    } else {
        // No Auth token found
        logger.warn("Missing request auth token.");
        return res.status(401).json({ error: "Unauthorised Access", msg: "Unauthorised Access. Login to access" });
    }
}

function checkAuthentication(req, res, next) {
    if (typeof req.headers["authorization"] !== "undefined") {
        // Validating AUTH token
        const token = req.headers["authorization"].split(" ")[1];
        try {
            req.headers.token = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
        } catch (err) {
            logger.error(`Error validating JWT from request. Err - ${err}`);
            return res
                .status(401)
                .json({ error: "Unauthorised Access", msg: "JWT Token unauthorised - reissue required." });
        }
        next();
    } else {
        // No Auth token found
        logger.warn("Missing request auth token.");
        return res.status(401).json({ error: "Unauthorised Access", msg: "Unauthorised Access. Login to access" });
    }
}

async function getUserDetails(username) {
    try {
        userDetails = await client.query(
            `SELECT * FROM ${constants.USERS_TABLE} where ${constants.USERS_USERNAME} = '${username}'`
        );
        logger.info(`Fetched users values successfully for user - ${username}`);
        return userDetails;
    } catch (err) {
        logger.error(`Error geting user profile details - ${err}`);
        throw err;
    }
}

async function getLocation(place_id) {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
        params: {
            place_id: place_id,
            key: GOOGLE_API_KEY,
        },
    });
    return response.data.result.geometry.location;
}

async function getCarDetails(user_id, number) {
    try {
        const carDetails = await client.query(
            `SELECT * FROM ${constants.CARS_TABLE} WHERE ${constants.CARS_NUMBER} = '${number}' AND ${constants.CARS_USER_ID_FK} = ${user_id}`
        );
        logger.info(`Car Details query executed for user_id '${user_id}' - ('${number}')`);
        return carDetails;
    } catch (err) {
        logger.error(`Error fetching cardeetails for user_id - '${user_id} - ${err}`);
        throw err;
    }
}

async function getAddress(place_id) {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
        params: {
            place_id: place_id,
            key: GOOGLE_API_KEY,
        },
    });
    return response.data.result.formatted_address;
}

module.exports = {
    checkAdminAuthentication,
    checkAuthentication,
    getUserDetails,
    getCarDetails,
    getLocation,
    getAddress,
};
