import { Action } from "./action";
import { Logger } from "./logger";
import type { ActionBaseContext, ActionHandler } from "./types";

jest.mock("./logger");

interface Context {
  salutation: "Hello" | "Hey" | "Hola";
}
type Input = string;
type Output = string;

function createMockHandler(
  fn?: ActionHandler<Context, Input, Output>
): ActionHandler<Context, Input, Output> {
  const defaultHandler: ActionHandler<Context, Input, Output> = (
    ctx,
    name = "World"
  ) => `${ctx.salutation}, ${name}`;

  return jest.fn().mockImplementationOnce(fn ?? defaultHandler);
}

function createMockContext(
  ctx: Context & Pick<ActionBaseContext, "displayName">
): Context & ActionBaseContext {
  return ctx;
}

describe("action", () => {
  describe("#constructor", () => {
    const context = createMockContext({
      displayName: "SayHelloAction",
      salutation: "Hola",
    });

    let actionInstance: Action<Context, Input, Output>;
    beforeAll(() => {
      const handler = createMockHandler();
      actionInstance = new Action(handler, context);
    });

    it("should return an instance of Action", () => {
      expect(actionInstance).toBeInstanceOf(Action);
    });
  });

  describe("#run (happy path)", () => {
    let context: ReturnType<typeof createMockContext>;
    let handler: ReturnType<typeof createMockHandler>;
    let result: unknown;

    beforeEach(async () => {
      context = createMockContext({
        salutation: "Hello",
        displayName: "SayHello",
      });
      handler = createMockHandler();

      const action = new Action(handler, context);

      result = await action.run("World");
    });

    it("should initialize the logger with correct context", () => {
      const expectedContext = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        correlationId: expect.any(String),
        displayName: context.displayName,
      };

      expect(Logger).toHaveBeenCalledWith(expectedContext);
    });

    it("should emit expected log when started", () => {
      const loggerInstance = (Logger as jest.Mock<Logger>).mock.instances[0];

      if (!loggerInstance) {
        throw new Error("Expected loggerInstance to be defined");
      }

      expect(loggerInstance.info).toHaveBeenNthCalledWith(
        1,
        'Action Started (input: "World")'
      );
    });

    it("should invoke the handler with expected arguments", () => {
      const input = "World";
      expect(handler).toHaveBeenCalledWith(context, input);
    });

    it("should emit expected log when completed", () => {
      const loggerInstance = (Logger as jest.Mock<Logger>).mock.instances[0];

      if (!loggerInstance) {
        throw new Error("Expected loggerInstance to be defined");
      }

      expect(loggerInstance.info).toHaveBeenLastCalledWith(
        'Action Completed (data: "Hello, World")'
      );
    });

    it("should return the expected result", () => {
      expect(result).toStrictEqual({ ok: true, data: "Hello, World" });
    });
  });

  describe("#run (when the handler throws an error)", () => {
    const expectedError = new Error("Oopsies!");

    let context: ReturnType<typeof createMockContext>;
    let handler: ReturnType<typeof createMockHandler>;
    let result: unknown;

    beforeEach(async () => {
      context = createMockContext({
        displayName: "SayHello",
        salutation: "Hello",
      });
      handler = createMockHandler(() => {
        throw expectedError;
      });

      const action = new Action(handler, context);

      result = await action.run("World");
    });

    it("should emit expected log", () => {
      const loggerInstance = (Logger as jest.Mock<Logger>).mock.instances[0];

      if (!loggerInstance) {
        throw new Error("Expected loggerInstance to be defined");
      }

      expect(loggerInstance.error).toHaveBeenLastCalledWith(
        "Action Failed (error: Oopsies!)"
      );
    });

    it("should return the expected result", () => {
      expect(result).toStrictEqual({
        ok: false,
        error: expectedError,
      });
    });
  });
});
