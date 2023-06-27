import { mockDeep } from "jest-mock-extended";
import { Action } from "./action";
import type { ActionBaseContext, ActionHandler } from "./types";

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
  return {
    ...ctx,
    logger: mockDeep<typeof console>(),
  };
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

  describe("#run", () => {
    let handler: ReturnType<typeof createMockHandler>;
    let context: ReturnType<typeof createMockContext>;
    let result: unknown;

    beforeAll(async () => {
      handler = createMockHandler();
      context = createMockContext({
        salutation: "Hello",
        displayName: "SayHello",
      });
      const action = new Action(handler, context);

      result = await action.run("World");
    });

    it("should emit expected log when started", () => {
      expect(context.logger.info).toHaveBeenNthCalledWith(
        1,
        '[SayHello] Action Started (input: "World")'
      );
    });

    it("should invoke the handler with expected arguments", () => {
      const input = "World";
      expect(handler).toHaveBeenCalledWith(context, input);
    });

    it("should emit expected log when completed", () => {
      expect(context.logger.info).toHaveBeenLastCalledWith(
        '[SayHello] Action Completed (data: "Hello, World")'
      );
    });

    it("should return the expected result", () => {
      expect(result).toStrictEqual({ ok: true, data: "Hello, World" });
    });

    describe("when the handler throws an error", () => {
      const expectedError = new Error("Oopsies!");
      beforeAll(async () => {
        handler = createMockHandler(() => {
          throw expectedError;
        });
        context = createMockContext({
          displayName: "SayHello",
          salutation: "Hello",
        });
        const action = new Action(handler, context);

        result = await action.run("World");
      });

      it("should emit expected log", () => {
        expect(context.logger.error).toHaveBeenLastCalledWith(
          "[SayHello] Action Failed (error: Oopsies!)"
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
});
