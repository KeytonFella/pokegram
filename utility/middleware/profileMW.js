// ======================== Input Validation ========================


// ======================== Route Access Logger ========================
// Winston logger setup
const { createLogger, transports, format} = require('winston');

// Create the logger
const logger = createLogger({
    level: 'info', 
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // log to the console
        new transports.File({ filename: 'profiles.log'}), // log to a file
    ]
})

function logRequest(req, res, next) {
    // Log the request
    logger.info(`Method: ${req.method} | URL accessed: http://localhost:5500/profiles${req.url}`);
    next();
}

module.exports = {
    logRequest
};