export interface LoggerContext {
  displayName: string;
  correlationId: string;
}

export type LoggerOptions = Partial<{
  quiet: boolean;
}>;

export function createLogger(
  context: LoggerContext,
  options: LoggerOptions = {},
): Logger {
  return new Logger(context, options);
}

export class Logger {
  private readonly ctx: LoggerContext;
  private readonly quiet: boolean;
  private readonly testEnv: boolean;

  constructor(context: LoggerContext, options: LoggerOptions = {}) {
    this.ctx = context;
    this.quiet = options.quiet ?? false;
    this.testEnv = process.env.NODE_ENV === "test";
  }

  /**
   * Log a message to the console using the `info` level. Message will be
   * prefixed with the `displayName` and `correlationId`
   *
   * @example
   * const logger = new Logger(\{ displayName: "MyClass", correlationId: "ABCD1234" \});
   * logger.info("My message") // [MyClass:ABCD1234] My message
   */
  error(message: string): void {
    if (this.testEnv) return;
    const formattedMessage = this.formatMessage(message);

    // eslint-disable-next-line no-console
    console.error(formattedMessage);
  }

  /**
   * Log a message to the console using the `info` level. Message will be
   * prefixed with the `displayName` and `correlationId`
   *
   * @example
   * const logger = new Logger(\{ displayName: "MyClass", correlationId: "ABCD1234" \});
   * logger.info("My message") // [MyClass:ABCD1234] My message
   */
  info(message: string): void {
    if (this.quiet || this.testEnv) return;
    const formattedMessage = this.formatMessage(message);

    // eslint-disable-next-line no-console
    console.info(formattedMessage);
  }

  private formatMessage(message: string): string {
    const { correlationId, displayName } = this.ctx;

    return `[${displayName}:${correlationId}] ${message}`;
  }
}
