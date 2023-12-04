require("dotenv").config();
var path = require("path");
var { Client } = require("pg");
var winston = require("winston");
var { transports, format } = require("winston");

// Setting up logs
var logger = winston.createLogger({
    transports: [
        new transports.Console(),
        new transports.File({
            filename: path.join(__dirname, "logs", "info.log"),
            level: "info",
            format: format.combine(
                format.json(),
                format.timestamp(),
                format.prettyPrint(),
                format.printf((info) => {
                    return `${info.timestamp} - ${info.level} : ${info.message}`;
                })
            ),
        }),
        new transports.File({
            filename: path.join(__dirname, "logs", "warning.log"),
            level: "warn",
            format: format.combine(format.json(), format.timestamp(), format.prettyPrint()),
        }),
        new transports.File({
            filename: path.join(__dirname, "logs", "error.log"),
            level: "error",
            format: format.combine(format.json(), format.timestamp(), format.prettyPrint()),
        }),
    ],
});

// Database Configurations
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Connect to the database
client
    .connect()
    .then(() => {
        logger.info(`Connected to the database`);
    })
    .catch((err) => {
        logger.error(`Error connecting to the database: ${err}`);
    });

module.exports = {
    // Cahce Configuration
    REDIS_PORT: 6379,

    // Token configurations
    ACCESS_TOKEN_SECRET_KEY: process.env.JWT_KEY,
    ACCESS_TOKEN_EXPIRY: process.env.JWT_EXPIRY,

    // Google Maps Api Key
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,

    // Database & Password config
    passwordSalt: parseInt(process.env.BCRYPT_PASS_SALT),
    client,

    // Logger
    logger,
};
