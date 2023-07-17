import { randomUUID } from "node:crypto";
import { createAction } from "@tnezdev/actions";
import type { Action, ActionHandler } from "@tnezdev/actions";
import type { Cache } from "../../effects/cache";
import type { User } from "../../schemas/user";

export interface Context {
  effects: {
    cache: Cache;
  };
}

export interface Input {
  user: User;
}

export interface Output {
  token: string;
}

export const handler: ActionHandler<Context, Input, Output> = async (
  ctx,
  input,
) => {
  const {
    effects: { cache },
  } = ctx;
  const { user } = input;

  const token = randomUUID();
  const data = {
    email: user.email,
    token,
  };
  const options = { ttl: 60 * 60 * 24 };
  await cache.set(user.id, data, options);

  return { token };
};

export const CreateEmailVerificationTokenAction = createAction(
  "CreateEmailVerificationTokenAction",
  handler,
);

export type CreateEmailVerificationTokenAction = Action<Context, Input, Output>;
