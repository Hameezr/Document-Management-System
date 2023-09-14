import pino, { Logger as PinoBaseLogger } from 'pino';
import { ILogger } from '../../domain/shared/interfaces/ILogger';
import { injectable } from "inversify";

const transportOpts = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    levelFirst: true,
    translateTime: 'yyyy-dd-mm, h:MM:ss TT',
    singleLine: true,
    ignore: 'hostname,pid',
    messageFormat: '[{context}] {msg}',
  },
};

const createPinoLogger = (context: string, logLevel: string = 'info'): PinoBaseLogger => {
  const logger = pino({
    level: logLevel,
    transport: {
      ...transportOpts,
    },
  }, pino.destination('./logs/my-log.log'));

  logger.setBindings({ context });

  return logger;
};
@injectable()
class PinoAppLogger implements ILogger{
  private logger: PinoBaseLogger;
  private context: string;

  static readonly DEFAULT_LOG_LEVEL: string = 'debug';
  static readonly DEFAULT_CTX: string = 'default';

  constructor() {
    this.context = PinoAppLogger.DEFAULT_CTX;
    this.logger = createPinoLogger(this.context, PinoAppLogger.DEFAULT_LOG_LEVEL);
  }

  setContext(ctx: string): void {
    this.context = ctx;
    this.logger.setBindings({ context: this.context });
  }

  debug(...data: any[]): void {
    this.logger.debug(data);
  }

  info(...data: any[]): void {
    this.logger.info(data);
  }

  warn(...data: any[]): void {
    this.logger.warn(data);
  }

  error(...data: any[]): void {
    this.logger.error(data);
  }
}

export default PinoAppLogger;
