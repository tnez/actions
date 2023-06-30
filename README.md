# @tnezdev/actions

Patterns to express business logic in a way that encourages using [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection#:~:text=In%20software%20engineering%2C%20dependency%20injection,leading%20to%20loosely%20coupled%20programs.) in order to interact with side-effects to simplify unit testing.

**Actions** are guaranteed to return a response in a consistent envelope, `{ ok: true, data: Data }` for the happy path and `{ ok: false, error: Error }` if an issue occurs. This allows for simplified error handling in the event of the sad path.

## Installation

- npm: `npm i @tnezdev/actions`
- pnpm: `pnpm add @tnezdev/actions`
- yarn: `yarn add @tnezdev/actions`

## Usage

You can express your core business logic as **actions**. You may do this in files that look something like this toy example:

```ts
/**
 * This might exist in an internal package if used in a monorepo setup.
 * Something like: <rootDir>/packages/actions/src/weather/get-temperature.ts
 */

import { createAction } from "@tnezdev/actions";
import type { ActionHandler } from "@tnezdev/actions";
import type { WeatherClient } from "@/clients/weather";

/**
 * Define the context that your action depends upon.
 */
export type GetTemperatureContext = {
  client: WeatherClient;
  /**
   * The scale used to express the temperature.
   * @default "celsius"
   */
  scale?: "celsius" | "fahrenheit";
};

/**
 * Define the input that the action should expect when `run`.
 */
export type GetTemperatureInput = { zipcode: string };

/**
 * Define the data payload that the action will output after a successful run.
 */
export type GetTemperatureOutput = { temperature: number };

/**
 * Then you can use these type definitions to create a strongly-typed handler.
 */
const handler: ActionHandler<
  GetTemperatureContext,
  GetTemperatureInput,
  GetTemperatureOutput
> = async (ctx, input) => {
  const { client, scale } = ctx;
  const { zipcode } = input;

  ctx.logger.info("You can emit logs from inside the action");
  const { temperature } = await client.getTempearture(zipcode, { scale });

  return { temperature };
};

/**
 * And finally export the handler which will be wrapped appropriately using the
 * `createAction` convenience method.
 */
export const GetTemperatureAction = createAction("GetTemperature", handler);
```

This can then be used in your application by something that is triggered by a user or the system. This may often be something like an API route or a handler invoked from a CLI. For this example, let's pretend we are using from inside an API route in a NextJS application that lives at `https://api.domain.com/weather/[zipcode]`.

```ts
import * as z from "zod";
import { GetTemperatureAction } from "@/actions/weather";
import { WeatherClient } from "@/clients/weather";
import { NextRequest, NextResponse } from "next/server";

const getTempeartureAction = new GetTemperatureAction({
  client: new WeatherClient(),
  scale: "fahrenheit",
});

const RequestContext = z.object({
  params: z.object({
    zipcode: z.string(),
  }),
});

export async function GET(request: , requestContext: unknown) {
  const { zipcode } = RequestContext.parse(requestContext);

  const { ok, data, error } = await getTempeartureAction.run({
    zipcode: "12345",
  });

  /**
   * Use the action's `ok` value to condition the status and any other
   * information you want to include in the response.
   */
  return ok
    ? NextResponse.json({ data })
    : NextResponse.next({ status: 500 }).json({ error });
}
```

When run, this will produce the following logs:

```txt
[GetTemparature:{correlation-id}] Action Started (input: {"zipcode":"12345"})
[GetTemperature:{correlation-id}] You can emit logs from inside the action
[GetTempearture:{correlation-id}] Action Completed (data: {"temperature":"75˚F"})
```

And the result returned from the action will be:

```
{ ok: true, data: { temperature: 72 } }
```
