import { createAction } from "@tnezdev/actions";
import type { ActionHandler } from "@tnezdev/actions";
import type { Data } from "../../effects/data";
import type { User } from "../../schemas/user";
import type { RequestEmailVerificationAction } from "./request-email-verification";

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

export const DISPLAY_NAME = "ActionName";

const handler: ActionHandler<Context, Input, void> = async (ctx, input) => {
  const {
    actions: { requestEmailVerificationAction },
    effects: { data },
  } = ctx;
  const { user } = input;

  await data.insert("Users", user);
  await requestEmailVerificationAction.run({ user });
};

export const ActionName = createAction<Context, Input, void>(
  DISPLAY_NAME,
  handler,
);
