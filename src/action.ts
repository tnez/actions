import { randomUUID } from "node:crypto";
import { Logger } from "./logger";
import type { ActionBaseContext, ActionHandler, ActionResult } from "./types";

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

  async run(
    input: Input,
    options: Partial<{ correlationId: string }> = {}
  ): Promise<ActionResult<Output>> {
    const logger = new Logger({
      correlationId: options.correlationId ?? randomUUID(),
      displayName: this.ctx.displayName,
    });

    try {
      logger.info(`Action Started (input: ${JSON.stringify(input)})`);
      const data = await this.handler(this.ctx, input);
      logger.info(`Action Completed (data: ${JSON.stringify(data)})`);
      return { ok: true as const, data };
    } catch (possibleError) {
      const error = wrapError(possibleError);
      logger.error(`Action Failed (error: ${error.message})`);
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
