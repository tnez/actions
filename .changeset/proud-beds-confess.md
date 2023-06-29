---
"@tnezdev/actions": minor
---

Add the logger instance to the context that is passed in to the action handler.

This allows the action handler to send logs with the context established by the action wrapper.

This means that you can do the following in your action handlers:

```ts
const handler: ActionHandler<Context, Input, Output> = (ctx, input) => {
  ctx.logger.info("This is a log from inside the action handler");

  // ...do something and return a result
  return doSomething(input);
};
```

And it will yield this log in addition to the normal logs that the wrapper emits:

```
[{DisplayName}:{CorrelationId}] Action Started (input: {input})]
[{DisplayName}:{CorrelationId}] This is a log from inside the action handler
[{DisplayName}:{CorrelationId}] Action Completed (data: {data})]
```