const express = require("express");
const router = express.Router();

const constants = require("../constants");
const { client, logger, passwordSalt, ACCESS_TOKEN_SECRET_KEY } = require("../config");
const { checkAuthentication, getUserDetails, getLocation } = require("../utilities/utility");

router.get("/profile", checkAuthentication, async function (req, res, next) {
    try {
        const userDetails = await getUserDetails(req.headers.token.username);
        return res.status(200).json({
            first_name: userDetails.rows[0][constants.USERS_FIRST_NAME],
            last_name: userDetails.rows[0][constants.USERS_LAST_NAME],
            username: userDetails.rows[0][constants.USERS_USERNAME],
            phone_number: userDetails.rows[0][constants.USERS_PHONE_NUMBER],
            driver_rating: userDetails.rows[0][constants.USERS_DRIVER_R],
            user_rating: userDetails.rows[0][constants.USERS_USER_R],
        });
    } catch (err) {
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    }
});

router.post("/profile", checkAuthentication, async function (req, res, next) {
    // Define the expected parameters
    const expectedParams = ["first_name", "last_name", "phone_number"];
    const missingParams = expectedParams.filter((param) => !(param in req.body));

    if (missingParams.length > 0) {
        // Respond with an error if there are missing parameters
        logger.warn(`Request has missing parameters - ${missingParams}`);
        return res.status(400).json({
            msg: `Missing parameters: ${missingParams.join(", ")}`,
        });
    }

    try {
        await client.query(
            `UPDATE ${constants.USERS_TABLE} SET ${constants.USERS_FIRST_NAME} = '${req.body.first_name}', ${constants.USERS_LAST_NAME} = '${req.body.last_name}', ${constants.USERS_PHONE_NUMBER} = '${req.body.phone_number}' where ${constants.USERS_USERNAME} = '${req.headers.token.username}'`
        );
        logger.info(`Values update successfully for ${req.headers.token.username}`);
        return res.status(200).json({ msg: "Values updated successfully" });
    } catch (err) {
        logger.error(`Error updating values in database for user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    }
});

router.get("/address", checkAuthentication, async function (req, res, next) {
    try {
        const address = await client.query(
            `SELECT ${constants.ADDRESS_APT_NUMBER}, ${constants.ADDRESS_STREET_NAME}, ${constants.ADDRESS_STATE}, ${constants.ADDRESS_ZIP_CODE}, ${constants.ADDRESS_COUNTRY}, ${constants.ADDRESS_PLACE_ID}, ST_X(${constants.ADDRESS_CORD}::geometry) AS latitude, ST_Y(${constants.ADDRESS_CORD}::geometry) as longitude from ${constants.ADDRESS_TABLE} where ${constants.ADDRESS_USER_ID_FK} = (SELECT ${constants.USERS_PK} FROM ${constants.USERS_TABLE} where ${constants.USERS_USERNAME} = '${req.headers.token.username}')`
        );
        logger.info(`Fetched all addresses for user - ${req.headers.token.username}`);
        return res.status(200).json({ address: address.rows });
    } catch (err) {
        logger.error(`Error fetching addresses for user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    }
});

router.delete("/address", checkAuthentication, async function (req, res, next) {
    try {
        userDetails = await getUserDetails(req.headers.token.username);
        await client.query(
            `DELETE FROM ${constants.ADDRESS_TABLE} WHERE ${constants.ADDRESS_PK} IN (SELECT ${
                constants.ADDRESS_PK
            } FROM ${constants.ADDRESS_TABLE} WHERE ${constants.ADDRESS_PLACE_ID} = '${req.body.place_id}' AND ${
                constants.ADDRESS_USER_ID_FK
            } = '${userDetails.rows[0][constants.USERS_PK]}' LIMIT 1)`
        );
        logger.info(`Deleted mentioned address for user - ${req.headers.token.username}`);
        return res.status(200).json({ msg: `Address Deleted` });
    } catch (err) {
        logger.error(`Error fetching addresses for user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    }
});

router.post("/address/add", checkAuthentication, async function (req, res, next) {
    const expectedParams = ["apt_number", "street_name", "state", "zip_code", "country", "place_id"];
    const missingParams = expectedParams.filter((param) => !(param in req.body));

    if (missingParams.length > 0) {
        // Respond with an error if there are missing parameters
        logger.warn(`Request has missing parameters - ${missingParams}`);
        return res.status(400).json({
            msg: `Missing parameters: ${missingParams.join(", ")}`,
        });
    }

    try {
        const location = await getLocation(req.body.place_id);
        const userDetails = await getUserDetails(req.headers.token.username);

        await client.query(
            `INSERT INTO ADDRESS(${constants.ADDRESS_USER_ID_FK}, ${constants.ADDRESS_APT_NUMBER}, ${
                constants.ADDRESS_STREET_NAME
            }, ${constants.ADDRESS_STATE}, ${constants.ADDRESS_ZIP_CODE}, ${constants.ADDRESS_COUNTRY}, ${
                constants.ADDRESS_PLACE_ID
            }, ${constants.ADDRESS_CORD}) VALUES (${userDetails.rows[0][constants.USERS_PK]}, '${
                req.body.apt_number
            }', '${req.body.street_name}', '${req.body.state}', '${req.body.zip_code}', '${req.body.country}', '${
                req.body.place_id
            }',ST_GeographyFromText('POINT(${location.lat} ${location.lng})'))`
        );
        logger.info(`Address added successfully for user ${req.headers.token.username}`);
        return res.status(200).json({
            msg: "Address added successfully",
        });
    } catch (err) {
        logger.error(`Error adding address for user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    }
});

router.get("/cars", checkAuthentication, async function (req, res, next) {});

router.post("/cars", checkAuthentication, async function (req, res, next) {});

router.delete("/cars", checkAuthentication, async function (req, res, next) {});

module.exports = router;
