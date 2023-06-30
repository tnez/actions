import type { LoggerContext } from "./logger";
import { Logger, createLogger } from "./logger";

const displayName = "DisplayName";
const correlationId = "ABCD1234";
const message = "The message";

describe("createLogger", () => {
  const context: LoggerContext = {
    correlationId: "1234-1234-1234-1234",
    displayName: "SomeAction",
  };
  let result: Logger;

  beforeEach(() => {
    result = createLogger(context);
  });

  it("should return a Logger instance", () => {
    expect(result).toBeInstanceOf(Logger);
  });
});

describe("logger", () => {
  describe("#info", () => {
    describe("when process.env.NODE_ENV != 'test'", () => {
      let spy: jest.SpyInstance;
      beforeEach(() => {
        process.env.NODE_ENV = "development";
        spy = jest.spyOn(console, "info").mockImplementationOnce(() => {
          /* noop */
        });
        const logger = new Logger({ displayName, correlationId });
        logger.info(message);
      });

      afterEach(() => {
        process.env.NODE_ENV = "test";
      });

      it("should invoke `console.info` with expected arguments", () => {
        expect(spy).toHaveBeenCalledWith(
          `[${displayName}:${correlationId}] ${message}`
        );
      });
    });

    describe("when process.env.NODE_ENV = 'test'", () => {
      let spy: jest.SpyInstance;
      beforeEach(() => {
        spy = jest.spyOn(console, "info");
        const logger = new Logger({ displayName, correlationId });
        logger.info(message);
      });

      it("should _not_ invoke `console.info`", () => {
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe("#error", () => {
    describe("when process.env.NODE_ENV != 'test'", () => {
      let spy: jest.SpyInstance;
      beforeEach(() => {
        process.env.NODE_ENV = "development";
        spy = jest.spyOn(console, "error").mockImplementationOnce(() => {
          /* noop */
        });
        const logger = new Logger({ displayName, correlationId });
        logger.error(message);
      });

      afterEach(() => {
        process.env.NODE_ENV = "test";
      });

      it("should invoke `console.error` with expected arguments", () => {
        expect(spy).toHaveBeenCalledWith(
          `[${displayName}:${correlationId}] ${message}`
        );
      });
    });

    describe("when process.env.NODE_ENV = 'test'", () => {
      let spy: jest.SpyInstance;
      beforeAll(() => {
        spy = jest.spyOn(console, "error");
        const logger = new Logger({ displayName, correlationId });
        logger.error(message);
      });

      it("should _not_ invoke `console.error` with expected arguments", () => {
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
