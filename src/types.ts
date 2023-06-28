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
  ctx: Context & ActionBaseContext,
  input: Input
) => Promise<Output> | Output;
