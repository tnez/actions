import { ActionFactory } from "./action-factory";
import type { Logger } from "./logger";

export type { Action } from "./action";

export interface ActionBaseContext {
  displayName: string;
}

interface ActionResultHappy<Output> {
  ok: true;
  data: Output;
  metadata: ActionMetadata;
}

interface ActionResultSad {
  ok: false;
  error: Error;
  metadata: ActionMetadata;
}

export type ActionResult<Output> = ActionResultHappy<Output> | ActionResultSad;

export type ActionHandler<Context, Input, Output> = (
  ctx: Context & ActionBaseContext & { logger: Logger },
  input: Input
) => Promise<Output> | Output;

export interface ActionMetadata {
  correlationId: string;
  displayName: string;
  runTime: {
    start: number;
    end?: number;
    duration?: number;
  };
}

/**
 * Return an ActionFactory that can be initialized with context.
 */
export function createAction<Context, Input, Output>(
  displayName: string,
  handler: ActionHandler<Context, Input, Output>
): ActionFactory<Context, Input, Output> {
  return new ActionFactory(displayName, handler);
}
