import { Action } from "./action";
import type { ActionHandler, ActionBaseContext } from "./types";

export class ActionFactory<Context, Input, Output> {
  private readonly baseContext: ActionBaseContext;
  private readonly handler: ActionHandler<Context, Input, Output>;

  constructor(
    displayName: string,
    handler: ActionHandler<Context, Input, Output>
  ) {
    this.baseContext = { displayName, logger: console };
    this.handler = handler;
  }

  initialize(context: Context): Action<Context, Input, Output> {
    return new Action(this.handler, { ...context, ...this.baseContext });
  }
}
