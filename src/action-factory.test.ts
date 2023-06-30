import { ActionFactory } from "./action-factory";
import { Action } from "./action";
import type { ActionHandler } from ".";

interface Context {
  factor: number;
}
interface Input {
  x: number;
}
type Output = number;
const multiply: ActionHandler<Context, Input, Output> = (ctx, input) =>
  input.x * ctx.factor;

describe("actionFactory", () => {
  describe("#constructor", () => {
    it("should return an instance of ActionFactory", () => {
      const action = new ActionFactory("MultiplyAction", multiply);
      expect(action).toBeInstanceOf(ActionFactory);
    });
  });

  describe("#initialize", () => {
    it("should return an instance of subclass that implements Action", () => {
      const SomeAction = new ActionFactory("MultiplyAction", multiply);
      const someActionInstance = SomeAction.initialize({ factor: 2 });
      expect(someActionInstance).toBeInstanceOf(Action);
    });
  });
});
