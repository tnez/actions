This example illustrates how you would use compose actions. In this case, we want to express the business use case of: **users/sign-up**. When this happens, we might want to do a few things:

1. Persist a new user to the data store
2. Verify the user's email by sending an email with a verification link
3. Send a welcome email

See the [src/actions/users/sign-up.ts](src/actions/users/sign-up.ts) to see how these actions are composed together.
