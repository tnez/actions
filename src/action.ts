import { randomUUID } from "node:crypto";
import { createLogger } from "./logger";
import type {
  ActionBaseContext,
  ActionHandler,
  ActionMetadata,
  ActionResult,
} from ".";

export class Action<Context, Input, Output> {
  private readonly ctx: Context & ActionBaseContext;
  private readonly handler: ActionHandler<Context, Input, Output>;

  constructor(
    handler: ActionHandler<Context, Input, Output>,
    context: Context & ActionBaseContext,
  ) {
    this.ctx = context;
    this.handler = handler;
  }

  async run(
    input: Input,
    initialMetadata: Partial<ActionMetadata> = {},
  ): Promise<ActionResult<Output>> {
    const metadata = new Metadata({
      ...initialMetadata,
      displayName: this.ctx.displayName,
    });
    const logger = createLogger(metadata.currentValue());

    try {
      logger.info(`Action Started (input: ${JSON.stringify(input)})`);
      const data = await this.handler({ ...this.ctx, logger }, input);
      metadata.stopRunTime();
      logger.info(`Action Completed (data: ${JSON.stringify(data)})`);
      return { ok: true as const, data, metadata: metadata.currentValue() };
    } catch (possibleError) {
      const error = wrapError(possibleError);
      metadata.stopRunTime();
      logger.error(`Action Failed (error: ${error.message})`);
      return { ok: false as const, error, metadata: metadata.currentValue() };
    }
  }
}

class Metadata {
  private readonly data: ActionMetadata;

  constructor(
    initialValue: Partial<ActionMetadata> &
      Pick<Required<ActionMetadata>, "displayName">,
  ) {
    const {
      correlationId = randomUUID(),
      displayName,
      runTime = { start: Date.now() },
    } = initialValue;

    this.data = {
      correlationId,
      displayName,
      runTime,
    };
  }

  currentValue(): ActionMetadata {
    return {
      ...this.data,
      runTime: this.getRunTime(),
    };
  }

  getRunTime(): ActionMetadata["runTime"] {
    const runTime = this.data.runTime;

    return {
      ...runTime,
      duration: runTime.end ? runTime.end - runTime.start : undefined,
    };
  }

  stopRunTime(): void {
    this.data.runTime.end = Date.now();
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
