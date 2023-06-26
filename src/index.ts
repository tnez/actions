import { ActionFactory } from "./action-factory";
import type { ActionHandler } from "./types";

/**
 * Return an ActionFactory that can be initialized with context.
 */
export function createAction<Context, Input, Output>(
  displayName: string,
  handler: ActionHandler<Context, Input, Output>
): ActionFactory<Context, Input, Output> {
  return new ActionFactory(displayName, handler);
}
