This is an example illustrates how **actions**, **clients**, and **entrypoint handlers** all interact together.

This example contains the following file structure:

```
├── actions
│   └── get-pokemon.ts
├── clients
│   └── pokemon.ts
└── entrypoint.ts
```

## `entrypoint.ts`

The [entrypoint](/src/examples/entrypoint.ts) represents something that might be used in an API route or CLI handler.

In this example it is just an arbitrary function that returns a string when executed, but you can easily imagine this as a route handler in a **NextJS** application.

## `actions/get-pokemon.ts`

The [actions/get-pokemon.ts](/src/examples/actions/get-pokemon.ts) contains the actual business logic. This action is **initialized** using the `createAction` method, and all required context is injected upon initialization. This allows us to inject things like mock clients under test as well as clients with appropriate configuration for different deployment environments.

## `clients/pokemon.ts`

The [clients/pokemon.ts](/src/examples/clients/pokemon.ts) represents an interface to some service. **Actions** will typically require some kind of clients or other effects to interact with the outside world and produce meaningful side-effects.
