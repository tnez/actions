import type { ActionBaseContext, ActionHandler, ActionResult } from "./types";

const LOG_LEVEL = Object.freeze({
  ERROR: "error",
  INFO: "info",
});

type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];

export class Action<Context, Input, Output> {
  private readonly ctx: Context & ActionBaseContext;
  private readonly handler: ActionHandler<Context, Input, Output>;

  constructor(
    handler: ActionHandler<Context, Input, Output>,
    context: Context & ActionBaseContext
  ) {
    this.ctx = context;
    this.handler = handler;
  }

  private log(message: string, level: LogLevel = "info"): void {
    const handler = this.ctx.logger[level];
    const prefix = `${this.ctx.displayName}`;
    const fullMessage = `[${prefix}] ${message}`;

    handler(fullMessage);
  }

  async run(input: Input): Promise<ActionResult<Output>> {
    try {
      this.log(`Action Started (input: ${JSON.stringify(input)})`);
      const data = await this.handler(this.ctx, input);
      this.log(`Action Completed (data: ${JSON.stringify(data)})`);
      return { ok: true as const, data };
    } catch (possibleError) {
      const error = wrapError(possibleError);
      this.log(`Action Failed (error: ${error.message})`, LOG_LEVEL.ERROR);
      return { ok: false as const, error };
    }
  }
}

function wrapError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  if (error instanceof Object) {
    return new Error(JSON.stringify(error));
  }

  return new Error("Unknown error");
}
