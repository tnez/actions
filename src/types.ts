import type { Logger } from "./logger";

export interface ActionBaseContext {
  displayName: string;
}
export interface ActionResultHappy<Output> {
  ok: true;
  data: Output;
  // metadata: ActionMetadata;
}
export interface ActionResultSad {
  ok: false;
  error: Error;
  // metadata: ActionMetadata;
}
export type ActionResult<Output> = ActionResultHappy<Output> | ActionResultSad;
export type ActionHandler<Context, Input, Output> = (
  ctx: Context & ActionBaseContext & { logger: Logger },
  input: Input
) => Promise<Output> | Output;
