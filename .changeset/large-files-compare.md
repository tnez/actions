---
"@tnezdev/actions": minor
---

Add `correlationId` to logs to make sequences of actions easier to track.

Change the log format from:

```
[ActionDisplayName] The provided message
```

to:

```
[ActionDisplayName:{correlationId}] The provided message
```

This will allow us to query related actions in the logs by searching for the `correlationId`.
