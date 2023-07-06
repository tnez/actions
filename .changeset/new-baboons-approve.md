---
"@tnezdev/actions": minor
---

Add `Metadata` to `ActionOutput`

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
