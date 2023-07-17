import { createAction } from "@tnezdev/actions";
import type { ActionHandler } from "@tnezdev/actions";
import type { RequestEmailVerificationAction } from "@/actions/users/request-email-verification";
import type { Data } from "@/effects/data";
import type { User } from "@/schemas/user";

export interface Context {
  actions: {
    requestEmailVerificationAction: RequestEmailVerificationAction;
  };
  effects: {
    data: Data;
  };
}
export interface Input {
  user: User;
}

export type Output = undefined;

export const DISPLAY_NAME = "ActionName";

const handler: ActionHandler<Context, Input, Output> = async (ctx, input) => {
  const {
    actions: { requestEmailVerificationAction },
    effects: { data },
  } = ctx;
  const { user } = input;

  await data.insert("Users", user);
  await requestEmailVerificationAction.run({ user });
};

export const ActionName = createAction<Context, Input, Output>(
  DISPLAY_NAME,
  handler,
);
