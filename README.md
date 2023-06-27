# @tnezdev/actions

Patterns to express business logic using dependency injection for side-effects for easy unit testing.

## Installation

- npm: `npm i @tnezdev/actions`
- pnpm: `pnpm add @tnezdev/actions`
- yarn: `yarn add @tnezdev/actions`

## Usage

You can express your core business logic as _actions_. You may do this in files that look something like this toy example:

```ts
// @/actions/src/weather/get-temperature.ts

import { createAction, ActionHandler } from "@tnezdev/actions";
import type { WeatherClient } from "@/clients/weather";

export type GetTemperatureContext = {
  client: WeatherClient;
  /**
   * Which scale to report the temperature.
   * @default "celsius"
   */
  scale?: "celsius" | "fahrenheit";
};
export type GetTemperatureInput = { zipcode: string };
export type GetTemperatureOutput = string;

const handler: ActionHandler<
  GetTemperatureContext,
  GetTemperatureInput,
  GetTemperatureOutput
> = async (ctx, input) => {
  const { client, scale } = ctx;
  const { zipcode } = input;

  const { temperature } = await client.getTempearture(zipcode, { scale });

  return temperature;
};

export const GetTemperatureAction = createAction("GetTemperature", handler);
```

This can then be configured as:

```ts
// apps/src/app/weather/get-temperature/route.ts
// (exposing a route at GET https://somedomain.com/weather/get-temperature/[zipcode])

import * as z from "zod";
import { GetTemperatureAction } from "@/actions/weather";
import { WeatherClient } from "@/clients/weather";
import type { NextResponse } from "next/server";

const getTempeartureAction = new GetTemperatureAction({
  client: new WeatherClient(),
  scale: "fahrenheit",
});

const RequestContext = z.object({
  params: z.object({
    zipcode: z.string(),
  }),
});

export async function GET(request: Request, requestContext: unknown) {
  const { zipcode } = RequestContext.parse(requestContext);

  const { ok, data, error } = await getTempeartureAction.run({
    zipcode: "12345",
  });

  return ok
    ? NextResponse.json(data)
    : NextResponse.status(500).json({ error: error.message });
}
```

When run, this will produce the following logs:

```txt
[GetTemparature] Action Started (input: {"zipcode":"12345"})
[GetTempearture] Action Completed (data: {"temperature":"75˚F"})
```
