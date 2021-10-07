import * as winston from 'winston';

const options = {
   file: {
      level: 'info',
      filename: 'logs/satoca.backend.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
   },
   console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
   },
};

const logger = winston.createLogger({
   levels: winston.config.npm.levels,
   format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.json(),
      winston.format.printf(
         (info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
         },
      ),
   ),
   transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
   ],
   exitOnError: false
})

export default logger