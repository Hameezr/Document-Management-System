import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// It will log to console as well if it is not production env
if (process.env.NODE_ENV !== 'production') {
  // logger.add(new winston.transports.Console({
  //   format: winston.format.simple(),
  // }));
}

// To log a generic message
const logGenericMessage = (
  layer: 'Controller' | 'Service' | 'Repository',
  action: string,
  level: 'info' | 'error' | 'warn' = 'info'
) => {
  const status = level === 'error' ? 'failed' : 'successful';
  const message = `Document ${action.toLowerCase()} ${status} in ${layer}`;
  
  logger.log({
    level,
    message,
  });
};

export { logger, logGenericMessage };
