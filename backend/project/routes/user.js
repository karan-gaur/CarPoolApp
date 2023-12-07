const express = require("express");
const router = express.Router();

const constants = require("../constants");
const { pool, logger } = require("../config");
const { checkAuthentication, getUserDetails, getLocation, checkAdminAuthentication } = require("../utilities/utility");

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

    const client = await pool.connect();
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
    } finally {
        client.release();
    }
});

router.get("/address", checkAuthentication, async function (req, res, next) {
    const client = await pool.connect();
    try {
        const address = await client.query(
            `SELECT ${constants.ADDRESS_PLACE_ID_PK}, ${constants.ADDRESS_APT_NUMBER}, ${constants.ADDRESS_STREET_NAME}, ${constants.ADDRESS_STATE}, ${constants.ADDRESS_ZIP_CODE}, ${constants.ADDRESS_COUNTRY}, ST_X(${constants.ADDRESS_CORD}::geometry) AS latitude, ST_Y(${constants.ADDRESS_CORD}::geometry) as longitude from ${constants.ADDRESS_TABLE} where ${constants.ADDRESS_USER_ID_FK} = (SELECT ${constants.USERS_PK} FROM ${constants.USERS_TABLE} where ${constants.USERS_USERNAME} = '${req.headers.token.username}')`
        );
        logger.info(`Fetched all addresses for user - ${req.headers.token.username}`);
        return res.status(200).json({ address: address.rows });
    } catch (err) {
        logger.error(`Error fetching addresses for user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    } finally {
        client.release();
    }
});

router.delete("/address", checkAuthentication, async function (req, res, next) {
    const client = await pool.connect();
    try {
        userDetails = await getUserDetails(req.headers.token.username);
        await client.query(
            `DELETE FROM ${constants.ADDRESS_TABLE} WHERE ${constants.ADDRESS_PLACE_ID_PK} = '${
                req.body.place_id
            }' AND ${constants.ADDRESS_USER_ID_FK} = '${userDetails.rows[0][constants.USERS_PK]}'`
        );
        logger.info(`Deleted mentioned address for user - ${req.headers.token.username}`);
        return res.status(200).json({ msg: `Address Deleted` });
    } catch (err) {
        logger.error(`Error fetching addresses for user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    } finally {
        client.release();
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

    const client = await pool.connect();
    try {
        const location = await getLocation(req.body.place_id);
        const userDetails = await getUserDetails(req.headers.token.username);

        // Checking if address exists
        const duplicateCheck = await client.query(
            `SELECT * FROM ${constants.ADDRESS_TABLE} WHERE ${constants.ADDRESS_PLACE_ID_PK} = '${req.body.place_id}'`
        );

        if (duplicateCheck.rows.length == 0) {
            await client.query(
                `INSERT INTO ADDRESS(${constants.ADDRESS_PLACE_ID_PK}, ${constants.ADDRESS_USER_ID_FK}, ${
                    constants.ADDRESS_APT_NUMBER
                }, ${constants.ADDRESS_STREET_NAME}, ${constants.ADDRESS_STATE}, ${constants.ADDRESS_ZIP_CODE}, ${
                    constants.ADDRESS_COUNTRY
                }, ${constants.ADDRESS_CORD}) VALUES ('${req.body.place_id}', ${
                    userDetails.rows[0][constants.USERS_PK]
                }, '${req.body.apt_number}', '${req.body.street_name}', '${req.body.state}', '${req.body.zip_code}', '${
                    req.body.country
                }', ST_GeographyFromText('POINT(${location.lat} ${location.lng})'))`
            );
        }
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
    } finally {
        client.release();
    }
});

router.get("/cars", checkAuthentication, async function (req, res, next) {
    const client = await pool.connect();
    try {
        const userDetails = await getUserDetails(req.headers.token.username);
        const cars = await client.query(
            `SELECT ${constants.CARS_MAKE}, ${constants.CARS_MODEL}, ${constants.CARS_NUMBER}, ${
                constants.CARS_COLOR
            }, ${constants.CARS_SEATS} FROM ${constants.CARS_TABLE} WHERE ${constants.CARS_USER_ID_FK} = '${
                userDetails.rows[0][constants.USERS_PK]
            }'`
        );
        logger.info(`Fetched all cars owned by user - ${req.headers.token.username}`);
        return res.status(200).json({
            cars: cars.rows,
        });
    } catch (err) {
        logger.error(`Error fetching all cars for user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    } finally {
        client.release();
    }
});

router.post("/cars", checkAuthentication, async function (req, res, next) {
    // Define the expected parameters
    const expectedParams = ["make", "model", "seats", "number", "color"];
    const missingParams = expectedParams.filter((param) => !(param in req.body));

    if (missingParams.length > 0) {
        // Respond with an error if there are missing parameters
        logger.warn(`Request has missing parameters - ${missingParams}`);
        return res.status(400).json({
            msg: `Missing parameters: ${missingParams.join(", ")}`,
        });
    }
    const client = await pool.connect();
    try {
        const userDetails = await getUserDetails(req.headers.token.username);
        await client.query(
            `INSERT INTO ${constants.CARS_TABLE} (${constants.CARS_USER_ID_FK}, ${constants.CARS_SEATS}, ${
                constants.CARS_NUMBER
            }, ${constants.CARS_MAKE}, ${constants.CARS_MODEL}, ${constants.CARS_COLOR}) VALUES ('${
                userDetails.rows[0][constants.USERS_PK]
            }', '${req.body.seats}', '${req.body.number}', '${req.body.make}', '${req.body.model}', '${
                req.body.color
            }')`
        );
        logger.info(`New car_detail added successfully for user - ${req.headers.token.username}`);
        return res.status(200).json({
            msg: "Car Detail added successfully!",
        });
    } catch (err) {
        logger.error(`Error adding new car_details for user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    } finally {
        client.release();
    }
});

router.delete("/cars", checkAuthentication, async function (req, res, next) {
    if (req.body.number == undefined) {
        logger.warn(`Request has missing parameters - 'number'`);
        return res.status(400).json({
            msg: `Missing parameters: 'number`,
        });
    }

    const client = await pool.connect();
    try {
        const userDetails = await getUserDetails(req.headers.token.username);
        await client.query(
            `DELETE FROM ${constants.CARS_TABLE} WHERE ${constants.CARS_NUMBER} = '${req.body.number}' AND ${
                constants.CARS_USER_ID_FK
            } = '${userDetails.rows[0][constants.USERS_PK]}'`
        );
        logger.info(`Car (${req.body.number}) successfully delted for user - ${req.headers.token.username}`);
        return res.status(200).json({
            msg: `car_detail successfully removed`,
        });
    } catch (err) {
        logger.error(`Error deleting cars (${req.body.number}) for user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    } finally {
        client.release();
    }
});

router.post("/admin", checkAdminAuthentication, async function (req, res, next) {
    if (req.body.query == undefined) {
        // Respond with an error if there are missing parameters
        logger.warn(`Request has missing parameters - 'query'`);
        return res.status(400).json({
            msg: `Missing parameters: 'query'`,
        });
    }
    const lowercaseInput = req.body.query.toLowerCase();
    const keywords = ["delete", "update"];
    if (keywords.some((keyword) => lowercaseInput.includes(keyword))) {
        logger.warn(`Update/Delete querries attempted by user - ${req.headers.token.username} on online terminal`);
        return res.status(401).json({
            error: "Unauthorised access",
            msg: "'UPDATE' or 'DELETE' querries are not permitted from online terminal",
        });
    }

    const client = await pool.connect();
    try {
        const response = await client.query(req.body.query);
        logger.info(
            `Online query executed successfully by admin user - ${req.headers.token.username} - ${req.body.query}`
        );
        return res.status(200).json({
            data: response.rows,
        });
    } catch (err) {
        logger.error(`Error executing script by admin user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Unable to execute script",
            msg: `${err}`,
        });
    } finally {
        client.release();
    }
});

module.exports = router;
