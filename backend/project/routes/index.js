const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

const constants = require("../constants");
const { client, logger, passwordSalt, ACCESS_TOKEN_SECRET_KEY } = require("../config");
const { checkAuthentication, getUserDetails } = require("../utilities/validator");

/* GET home page. */
router.get("/status-check", function (req, res, next) {
    logger.log("info", "Status check request recevied");
    return res.status(200).json({ status: "Server is running" });
});

router.post("/login", async function (req, res, next) {
    const expectedParams = ["username", "password"];
    const missingParams = expectedParams.filter((param) => !(param in req.body));

    if (missingParams.length > 0) {
        // Respond with an error if there are missing parameters
        logger.warn(`Request has missing parameters - ${missingParams}`);
        return res.status(400).json({
            msg: `Missing parameters: ${missingParams.join(", ")}`,
        });
    }

    try {
        const userDetails = await getUserDetails(req.body.username);
        if (userDetails.rows.length == 0) {
            logger.info(`No users with given username - ${req.body.username}`);
            return res.status(404).json({ error: "User not found", msg: "No users with given username" });
        }

        if (await bcrypt.compare(req.body.password, userDetails.rows[0][constants.USERS_PASSWORD])) {
            logger.info("Login Success");
            return res.status(200).json({
                token: jwt.sign(
                    {
                        first_name: userDetails.rows[0][constants.USERS_FIRST_NAME],
                        last_name: userDetails.rows[0][constants.USERS_LAST_NAME],
                        username: userDetails.rows[0][constants.USERS_USERNAME],
                    },
                    ACCESS_TOKEN_SECRET_KEY
                ),
            });
        } else {
            logger.info("Incorrect Password entered by user");
            return res.status(401).json({
                error: "Unauthorised Access",
                msg: "Incorrect password. Try Again!",
            });
        }
    } catch (err) {
        logger.error(`Error fetching password from Database - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    }
});

router.post("/register", async function (req, res, next) {
    const expectedParams = ["first_name", "last_name", "username", "password", "phone_number"];
    const missingParams = expectedParams.filter((param) => !(param in req.body));

    if (missingParams.length > 0) {
        // Respond with an error if there are missing parameters
        logger.warn(`Request has missing parameters - ${missingParams}`);
        return res.status(400).json({
            msg: `Missing parameters: ${missingParams.join(", ")}`,
        });
    }

    try {
        // Checking if user with given username exists
        const users = await client.query(
            `SELECT * from "${constants.USERS_TABLE}" where ${constants.USERS_USERNAME}='${req.body.username}'`
        );
        if (users.rows.length >= 1) {
            logger.warn(`Registration of user cancelled as user already exists - ${req.body.username}`);
            return res.status(409).json({
                error: "Conflict with username",
                msg: `User with username - "${req.body.username}" - already exists!`,
            });
        }

        // Hasing password and storing in database
        const hash = await bcrypt.hash(req.body.password, await bcrypt.genSalt(passwordSalt));
        client.query(
            `INSERT INTO ${constants.USERS_TABLE}(${constants.USERS_FIRST_NAME}, ${constants.USERS_LAST_NAME}, ${constants.USERS_PHONE_NUMBER}, ${constants.USERS_USERNAME}, ${constants.USERS_PASSWORD}) VALUES ('${req.body.first_name}', '${req.body.last_name}', '${req.body.phone_number}','${req.body.username}', '${hash}' )`
        );
        logger.info(`New user creaeted - ${req.body.username}`);
        return res.status(200).json({
            msg: "User created.",
        });
    } catch (err) {
        logger.error(`Error fetching similar users from database - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    }
});

router.post("/password", checkAuthentication, async function (req, res, next) {
    if (req.body.password == undefined) {
        return res.status(400).json({
            error: "Bad Request",
            msg: `Required parameters are missing: 'password'`,
        });
    }
    try {
        const userDetails = await getUserDetails(req.headers.token.username);
        if (await bcrypt.compare(req.body.password, userDetails.rows[0][constants.USERS_PASSWORD])) {
            logger.info("Password Match Successful");
            return res.status(200).json({
                msg: "Password match",
            });
        }
        logger.info("Incorrect Password entered by user");
        return res.status(401).json({
            error: "Unauthorised Access",
            msg: "Incorrect password. Try Again!",
        });
    } catch (err) {
        logger.error(`Error updating password for user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    }
});

router.post("/password/update", checkAuthentication, async function (req, res, next) {
    const expectedParams = ["old_password", "new_password"];
    const missingParams = expectedParams.filter((param) => !(param in req.body));

    if (missingParams.length > 0) {
        // Respond with an error if there are missing parameters
        logger.warn(`Request has missing parameters - ${missingParams}`);
        return res.status(400).json({
            msg: `Missing parameters: ${missingParams.join(", ")}`,
        });
    }

    try {
        const userDetails = await getUserDetails(req.headers.token.username);
        passMatch = await bcrypt.compare(req.body.old_password, userDetails.rows[0][constants.USERS_PASSWORD]);
        if (passMatch) {
            logger.info("Password Match Successful");
            new_password = await bcrypt.hash(req.body.new_password, await bcrypt.genSalt(passwordSalt));

            await client.query(`UPDATE ${constants.USERS_TABLE} SET ${constants.USERS_PASSWORD} = '${new_password}'`);
            logger.info(`Password update successful for - ${req.headers.token.username}`);
            return res.status(200).json({
                msg: "Password Successfully updated",
            });
        }
        logger.info("Incorrect Password entered by user");
        return res.status(401).json({
            error: "Unauthorised Access",
            msg: "Incorrect password. Try Again!",
        });
        i;
    } catch (err) {
        logger.error(`Error updating ${req.headers.token.username}'s password in Database - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    }
});

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
            `SELECT ${constants.ADDRESS_APT_NUMBER}, ${constants.ADDRESS_STREET_NAME}, ${constants.ADDRESS_STATE}, ${constants.ADDRESS_ZIP_CODE}, ${constants.ADDRESS_COUNTRY}, ST_X(${constants.ADDRESS_CORD}::geometry) AS latitude, ST_Y(${constants.ADDRESS_CORD}::geometry) as longitude from ${constants.ADDRESS_TABLE} where ${constants.ADDRESS_USER_ID_FK} = (SELECT ${constants.USERS_PK} FROM ${constants.USERS_TABLE} where ${constants.USERS_USERNAME} = '${req.headers.token.username}')`
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
        const address = await client.query(
            `DELETE FROM ${constants.ADDRESS_TABLE} where ${constants.ADDRESS_APT_NUMBER} = ${
                req.body.apt_number
            } AND ST_X(${constants.ADDRESS_CORD}::geometry) = ${req.body.latitute} AND ST_Y(${
                constants.ADDRESS_CORD
            }::geometry) = ${req.body.longitude} AND ${constants.ADDRESS_USER_ID_FK} = '${
                userDetails.rows[0][constants.USERS_PK]
            }' LIMIT 1')`
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

router.post("/address/add", checkAuthentication, async function (req, res, next) {
    const expectedParams = ["apt_number", "street_name", "state", "zip_code", "country", "latitude", "longitude"];
    const missingParams = expectedParams.filter((param) => !(param in req.body));

    if (missingParams.length > 0) {
        // Respond with an error if there are missing parameters
        logger.warn(`Request has missing parameters - ${missingParams}`);
        return res.status(400).json({
            msg: `Missing parameters: ${missingParams.join(", ")}`,
        });
    }
    try {
        userDetails = await getUserDetails(req.headers.token.username);
        await client.query(
            `INSERT INTO ADDRESS(${constants.ADDRESS_USER_ID_FK}, ${constants.ADDRESS_APT_NUMBER}, ${
                constants.ADDRESS_STREET_NAME
            }, ${constants.ADDRESS_STATE}, ${constants.ADDRESS_ZIP_CODE}, ${constants.ADDRESS_COUNTRY}, ${
                constants.ADDRESS_CORD
            }) VALUES (${userDetails.rows[0][constants.USERS_PK]}, '${req.body.apt_number}', '${
                req.body.street_name
            }', '${req.body.state}', '${req.body.zip_code}', '${req.body.country}', ST_GeographyFromText('POINT(${
                req.body.latitude
            } ${req.body.longitude})'))`
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

module.exports = router;
