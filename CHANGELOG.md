# @tnezdev/actions

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
