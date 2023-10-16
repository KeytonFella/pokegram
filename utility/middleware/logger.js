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
    ]
})

function logRequest(req, res, next) {
    // Log the request
    logger.info(`Method: ${req.method} | URL accessed: ${`${req.protocol}://${req.get('host')}${req.originalUrl}`} | Status: ${res.statusCode}, ${res.statusMessage}`);
    next();
}

module.exports = {
    logRequest
};