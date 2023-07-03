import { createAction } from "../..";
import type { ActionHandler } from "../..";
import type { Pokemon, PokemonClient } from "../clients/pokemon";

export interface GetPokemonContext {
  clients: {
    pokemon: PokemonClient;
  };
}

export interface GetPokemonInput {
  id: string;
}

export type GetPokemonOutput = Omit<Pokemon, "attacks">;

const handler: ActionHandler<
  GetPokemonContext,
  GetPokemonInput,
  GetPokemonOutput
> = async (ctx, input) => {
  const {
    clients: { pokemon },
  } = ctx;
  const { id } = input;

  ctx.logger.info(`Getting Pokemon with ID: ${id}`);
  const data = await pokemon.get(id);

  return data;
};

export const GetPokemonAction = createAction("GetPokemon", handler);
