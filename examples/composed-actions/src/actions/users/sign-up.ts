import { createAction } from "@tnezdev/actions";
import type { Action, ActionHandler } from "@tnezdev/actions";
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

export interface Output {
  message: string;
}

export const DISPLAY_NAME = "ActionName";

const handler: ActionHandler<Context, Input, Output> = async (ctx, input) => {
  const {
    actions: { requestEmailVerificationAction },
    effects: { data },
  } = ctx;
  const { user } = input;

  await data.insert("Users", user);
  await requestEmailVerificationAction.run({ user });

  return {
    message: `Successfully signed up new user: ${user.id} (${user.displayName})`,
  };
};

export const UserSignUpAction = createAction<Context, Input, Output>(
  DISPLAY_NAME,
  handler,
);

export type UserSignUpAction = Action<Context, Input, Output>;
