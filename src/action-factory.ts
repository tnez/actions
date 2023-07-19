import { Action } from "./action";
import type { ActionHandler, ActionBaseContext, ActionOptions } from ".";

export type ActionInitializeOptions = Partial<{
  quiet: boolean;
}>;

export class ActionFactory<Context, Input, Output> {
  private readonly baseContext: ActionBaseContext;
  private readonly handler: ActionHandler<Context, Input, Output>;

  constructor(
    displayName: string,
    handler: ActionHandler<Context, Input, Output>
  ) {
    this.baseContext = { displayName };
    this.handler = handler;
  }

  initialize(
    context: Context,
    options: ActionOptions = {}
  ): Action<Context, Input, Output> {
    return new Action(
      this.handler,
      { ...context, ...this.baseContext },
      options
    );
  }
}
