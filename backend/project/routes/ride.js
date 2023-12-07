var express = require("express");
const { logger, pool } = require("../config");
const constants = require("../constants");
const { checkAuthentication, getCarDetails, getUserDetails, getLocation, getAddress } = require("../utilities/utility");

var router = express.Router();

router.post("/history", checkAuthentication, function (req, res, next) {});

router.post("/details", checkAuthentication, async function (req, res, next) {});

router.post("/publish", checkAuthentication, async function (req, res, next) {
    const expectedParams = ["car_number", "departure_time", "source_addr", "dest_addr", "seats_available"];
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
        const source = await getLocation(req.body.source_addr);
        const destination = await getLocation(req.body.dest_addr);
        const userDetails = await getUserDetails(req.headers.token.username);
        const carDetails = await getCarDetails(userDetails.rows[0][constants.USERS_PK], req.body.car_number);
        if (carDetails.rows.length == 0) {
            logger.info(
                `No Cars exist for user - '${req.headers.token.username}' with number - '${req.body.car_number}'`
            );
            return res.status(404).json({
                error: "Car not found",
                msg: `No cars exists for user with number - '${req.body.car_number}'`,
            });
        }

        await client.query(
            `INSERT INTO ${constants.RIDE_TABLE} (${constants.RIDE_DRIVER_IF_FK}, ${constants.RIDE_CAR_ID_FK}, ${
                constants.RIDE_SEATS
            }, ${constants.RIDE_DEPARTURE}, ${constants.RIDE_SOURCE}, ${constants.RIDE_SOURCE_ID}, ${
                constants.RIDE_DEST
            }, ${constants.RIDE_DEST_ID}) VALUES (${userDetails.rows[0][constants.USERS_PK]}, ${
                carDetails.rows[0][constants.CARS_PK]
            }, ${req.body.seats_available}, '${req.body.departure_time}', ST_GeographyFromText('POINT(${source.lat} ${
                source.lng
            })'), '${req.body.source_addr}', ST_GeographyFromText('POINT(${destination.lat} ${destination.lng})'), '${
                req.body.dest_addr
            }')`
        );
        logger.info(`Ride published successfully by user - '${req.headers.token.username}'`);
        return res.status(200).json({ msg: "Ride published successfully" });
    } catch (err) {
        logger.error(`Error publishing ride by user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    } finally {
        client.release();
    }
});

router.post("/user_review", checkAuthentication, async function (req, res, next) {});

router.post("/active", checkAuthentication, async function (req, res, next) {
    if (req.body.is_driver == undefined) {
        logger.warn(`Request has missing parameters - 'is_driver'`);
        return res.status(400).json({
            msg: `Missing parameters: 'is_driver'`,
        });
    }

    const client = await pool.connect();
    try {
        const userDetails = await getUserDetails(req.headers.token.username);
        var activeRides;
        if (req.body.is_driver) {
            activeRides = await client.query(
                `SELECT r.${constants.RIDE_PK}, c.${constants.CARS_SEATS}, c.${constants.CARS_NUMBER}, c.${
                    constants.CARS_MAKE
                }, c.${constants.CARS_MODEL}, r.${constants.RIDE_COMPLETED}, r.${
                    constants.RIDE_SEATS
                } AS SEATS_AVAILABLE, r.${constants.RIDE_DEPARTURE}, r.${constants.RIDE_SOURCE_ID}, r.${
                    constants.RIDE_DEST_ID
                }, ST_X(r.${constants.RIDE_SOURCE}::geometry) AS source_latitude, ST_Y(r.${
                    constants.RIDE_SOURCE
                }::geometry) as source_longitude, ST_X(r.${constants.RIDE_DEST}::geometry) AS dest_latitude, ST_Y(r.${
                    constants.RIDE_DEST
                }::geometry) as dest_longitude FROM ${constants.CARS_TABLE} AS c RIGHT JOIN (SELECT * FROM ${
                    constants.RIDE_TABLE
                } WHERE ${constants.RIDE_DRIVER_IF_FK} = ${userDetails.rows[0][constants.USERS_PK]} AND ${
                    constants.RIDE_COMPLETED
                } = false) AS r on r.${constants.RIDE_CAR_ID_FK}= c.${constants.CARS_PK}`
            );
            logger.info(`Fetched all active rides for the driver - ${req.headers.token.username}`);
        } else {
            activeRides = await client.query(`
            SELECT R.${constants.RIDE_PK}, R.${constants.RIDE_DEPARTURE}, RD.${constants.RIDE_D_SOURCE}, RD.${
                constants.RIDE_SOURCE_ID
            }, RD.${constants.RIDE_D_DEST}, RD.${constants.RIDE_D_DEST_ID} FROM ${
                constants.RIDE_TABLE
            } AS R INNER JOIN ${constants.RIDE_D_TABLE} AS RD ON R.${constants.RIDE_PK} = RD.${
                constants.RIDE_D_RID_FK
            } WHERE RD.${constants.RIDE_D_RIDE_COMPLETED} = false AND RD.${constants.RIDE_D_UID_FK} = ${
                userDetails.rows[0][constants.USERS_PK]
            }
            `);
            logger.info(`Fetched active rides for customer - '${req.headers.token.username}`);
        }
        for (i = 0; i < activeRides.rows.length; i++) {
            if (activeRides.rows[i][constants.RIDE_SOURCE_ID] !== undefined)
                activeRides.rows[i][constants.RIDE_SOURCE_ID] = await getAddress(
                    activeRides.rows[i][constants.RIDE_SOURCE_ID]
                );

            if (activeRides.rows[i][constants.RIDE_DEST_ID] !== undefined)
                activeRides.rows[i][constants.RIDE_DEST_ID] = await getAddress(
                    activeRides.rows[i][constants.RIDE_DEST_ID]
                );
        }
        return res.status(200).json({ activeRides: activeRides.rows });
    } catch (err) {
        logger.error(`Error finding active rides for user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    } finally {
        client.release();
    }
});

router.post("/schedule", checkAuthentication, async function (req, res, next) {
    const expectedParams = ["source_addr", "dest_addr"];
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
        const source = await getLocation(req.body.source_addr);
        const dest = await getLocation(req.body.dest_addr);
        const driverDetails = await client.query(
            `SELECT ${constants.RIDE_PK}, ${constants.RIDE_DEPARTURE}, ${constants.RIDE_SEATS}, ${constants.CARS_MAKE}, ${constants.CARS_MODEL}, ${constants.CARS_COLOR} from ${constants.CARS_TABLE} RIGHT JOIN (SELECT * FROM ${constants.RIDE_TABLE} WHERE ${constants.RIDE_SEATS} >= 1 AND ${constants.RIDE_COMPLETED} = false AND ST_DWithin(${constants.RIDE_TABLE}.${constants.RIDE_SOURCE}, 'POINT(${source.lat} ${source.lng})'::geography, 3 * 1700) AND ST_DWithin(${constants.RIDE_DEST}, 'POINT(${dest.lat} ${dest.lng})'::geography, 3 * 1700) ) AS R ON ${constants.CARS_PK}=R.${constants.RIDE_CAR_ID_FK}`
        );
        logger.info(`Fetched all available ride for user - ${req.headers.token.username}`);

        if (driverDetails.rows.length == 0) {
            logger.info(`No drivers available for user's request`);
            return res.status(404).json({ msg: "There are no driver available for your preferences" });
        }

        // Blocking the row
        const userDetails = await getUserDetails(req.headers.token.username);
        await client.query(`BEGIN;`);
        await client.query(
            `SELECT * FROM ${constants.RIDE_TABLE} WHERE ${constants.RIDE_PK} = ${
                userDetails.rows[0][constants.USERS_PK]
            } FOR UPDATE;`
        );

        await client.query(
            `UPDATE ${constants.RIDE_TABLE} SET ${constants.RIDE_SEATS} = ${constants.RIDE_SEATS}-1 WHERE ${
                constants.RIDE_PK
            } = '${driverDetails.rows[0][constants.RIDE_PK]}'`
        );
        await client.query(
            `INSERT INTO ${constants.RIDE_D_TABLE} (${constants.RIDE_D_RID_FK}, ${constants.RIDE_D_UID_FK}, ${
                constants.RIDE_D_USERNAME
            }, ${constants.RIDE_D_SOURCE}, ${constants.RIDE_D_SOURCE_ID}, ${constants.RIDE_D_DEST}, ${
                constants.RIDE_D_DEST_ID
            }) VALUES (${driverDetails.rows[0][constants.RIDE_PK]}, ${userDetails.rows[0][constants.USERS_PK]}, '${
                req.headers.token.username
            }', ST_GeographyFromText('POINT(${source.lat} ${source.lng})'), '${
                req.body.source_addr
            }', ST_GeographyFromText('POINT(${dest.lat} ${dest.lng})'), '${req.body.dest_addr}')`
        );
        await client.query(`COMMIT;`);
        logger.info(
            `Ride successfully booked for user - '${req.headers.token.username}'. RIDE_ID - '${
                driverDetails.rows[0][constants.RIDE_PK]
            }'`
        );
        return res.status(200).json({ msg: `Ride booked` });
    } catch (err) {
        await client.query(`ROLLBACK`);
        logger.error(`Error scheduling rides for user - ${req.headers.token.username} - ${err}`);
        return res.status(500).json({
            error: "Internal Server Error",
            msg: "Internal Server Error. Please try again in some time!",
        });
    } finally {
        client.release();
    }
});

router.post("/start", function (req, res, next) {});

router.post("/end", function (req, res, next) {});

module.exports = router;
