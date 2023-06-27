import { ActionFactory } from "./action-factory";
import type { ActionHandler } from "./types";
import { createAction } from ".";

interface Context {
  factor: number;
}
type Input = number;
type Output = number;

const handler: ActionHandler<Context, Input, Output> = (ctx, input) =>
  ctx.factor * input;

describe("@tnezdev/actions", () => {
  describe("createAction", () => {
    it("should return an instance of an ActionFactory", () => {
      const MultiplyAction = createAction("MultiplyAction", handler);
      expect(MultiplyAction).toBeInstanceOf(ActionFactory);
    });
  });
});
