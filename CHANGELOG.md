# @tnezdev/actions

## 0.4.0

### Minor Changes

- a13b38c: docs: switch to using fully fledged example packages

  Switch examples to use fully formed packages where each one has their own `package.json` and links to the built library.

- 5d6d449: Add `Metadata` to `ActionOutput`

  Previously, the action output would be `{ ok: true, data: Data }` for the happy path and `{ ok: false, error: Error }` for the sad path. We have added a `metadata` property to both paths that is defined thusly:

  ```ts
  export interface ActionMetadata {
    correlationId: string;
    displayName: string;
    runTime: {
      start: number;
      end?: number;
      duration?: number;
    };
  }
  ```

  Which in real-world usage will look something like this:

  ```
  {
    ok: true,
    data: {
      temperature: 72,
    },
    metadata: {
      correlationId: '<correation-id>',
      displayName: 'GetTemperature',
      runTime: {
        start: 1688674365730,
        end: 1688674380205,
        duration: 14475,
      }
    }
  }
  ```

- f76b2f2: Export Action type for better DX when composing actions (closes #42)

  We now export the `Action` type which allows you to do the following inside custom actions.

  ```ts
  import type { Action } from "@tnezdev/actions";

  /**
   * You would define your action logic here...
   */
  export const SomeAction = (createAction<Context, Input, Output> = (
    ctx,
    input,
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

### Patch Changes

- 886450f: docs: move examples out of `/src` into their own top-level directory

## 0.3.2

### Patch Changes

- 4d9f680: Create examples illustrating real world usage

  Added `/examples` that contains the following illustrating how **actions**, **clients**, and **entrypoint handlers** all interact.

  ```
  .
  ├── README.md
  ├── actions
  │   └── get-pokemon.ts
  ├── clients
  │   └── pokemon.ts
  └── entrypoint.ts

  2 directories, 4 files
  ```

## 0.3.1

### Patch Changes

- b17bfb8: Add license (`Apache 2.0`)
- f48413d: Re-enable edge-environment for unit tests in CI (closes #6)
- 9a7833e: fix: add missing type exports (closes #24)

  The documentation gives an example of doing something like this:

  ```ts
  import { createAction } from "@tnezdev/actions";
  import type { ActionHandler } from "@tnezdev/actions";

  type Conetxt = {};
  type Input = {};
  type Output = {};

  const handler: ActionHandler<Context, Input, Output> = () => {};
  ```

  However, the `ActionHandler` type was not being exported before this fix.

## 0.3.0

### Minor Changes

- cc3b908: Add the logger instance to the context that is passed in to the action handler.

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

### Patch Changes

- 434c30a: Corrections and enhancements to the examples in the `README.md`.

## 0.2.0

### Minor Changes

- 9c592e4: Add `correlationId` to logs to make sequences of actions easier to track.

  Change the log format from:

  ```
  [ActionDisplayName] The provided message
  ```

  to:

  ```
  [ActionDisplayName:{correlationId}] The provided message
  ```

  This will allow us to query related actions in the logs by searching for the `correlationId`.

## 0.1.0

### Minor Changes

- 208ebc1: Setup initial functionality
