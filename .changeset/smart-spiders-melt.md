---
"@tnezdev/actions": minor
---

Export Action type for better DX when composing actions (closes #42)

We now export the `Action` type which allows you to do the following inside custom actions.

```ts
import type { Action } from "@tnezdev/actions";

/**
 * You would define your action logic here...
 */
export const SomeAction = (createAction<Context, Input, Output> = (
  ctx,
  input
) => {
  /* ... */
});

/**
 * And then finally export the type for this same action
 */
export type SomeAction = Action<Context, Input, Output>;
```

Then you can use these exported action types in the context definition of other actions:

```ts
import type { SomeAction } from "./some-action";

export interface Context {
  actions: {
    someAction: SomeAction;
  };
}
```

To better illustrate how this works, we've included a new [composed-actions example](/examples/composed-actions/README.md).
