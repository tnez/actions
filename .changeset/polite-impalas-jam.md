---
"@tnezdev/actions": patch
---

fix: add missing type exports (closes #24)

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
