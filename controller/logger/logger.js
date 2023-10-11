
const { createLogger, transports, format} = require('winston');

// create the logger
const logger = createLogger({
    level: 'info', // this will log only messages with the level 'info' and above
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // log to the console
        new transports.File({ filename: 'app.log'}), // log to a file
    ]
})


process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    // perform some kind of cleanup if needed
    logger.on('finish', () => {
        process.exit(1);
    })
})


module.exports = logger;