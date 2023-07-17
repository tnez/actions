import { createAction } from "@tnezdev/actions";
import type { Action, ActionHandler } from "@tnezdev/actions";
import type { Email } from "../../effects/email";
import type { User } from "../../schemas/user";
import type { CreateEmailVerificationTokenAction } from "./create-email-verification-token";

export interface Context {
  actions: {
    createEmailVerificationToken: CreateEmailVerificationTokenAction;
  };
  config: {
    baseUrl: string;
  };
  effects: {
    email: Email;
  };
}

export interface Input {
  user: User;
}

export const handler: ActionHandler<Context, Input, void> = async (
  ctx,
  input,
) => {
  const {
    actions: { createEmailVerificationToken },
    config: { baseUrl },
    effects: { email },
  } = ctx;
  const { user } = input;

  const createEmailVerificationTokenResult =
    await createEmailVerificationToken.run({
      user,
    });
  if (!createEmailVerificationTokenResult.ok) {
    throw createEmailVerificationTokenResult.error;
  }

  const subject = `Please verify your email ${user.displayName}!`;
  const body = `Welcome ${user.displayName}! Please verify your email by clicking this link: ${baseUrl}/verify-email?token=${createEmailVerificationTokenResult.data.token}`;
  await email.send(user.email, subject, body);
};

export const RequestEmailVerificationAction = createAction(
  "RequestEmailVerificationAction",
  handler,
);

export type RequestEmailVerificationAction = Action<Context, Input, void>;
