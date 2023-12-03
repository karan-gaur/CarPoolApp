var jwt = require("jsonwebtoken");

const constants = require("../constants");
const { ps, logger, ACCESS_TOKEN_SECRET_KEY, client } = require("../config");

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

module.exports = {
    checkAuthentication,
    getUserDetails,
};
