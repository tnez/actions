import * as z from "zod";
import { GetPokemonAction } from "./actions/get-pokemon";
import { PokemonClient } from "./clients/pokemon";

const getPokemon = GetPokemonAction.initialize({
  clients: {
    pokemon: new PokemonClient(),
  },
});

const InputSchema = z.object({
  id: z.string(),
});

export async function someHandler(input: unknown): Promise<string> {
  const validatedInput = InputSchema.parse(input);

  const result = await getPokemon.run(validatedInput);
  if (!result.ok) throw result.error;
  const {
    data: { id, health, name },
  } = result;

  return `The pokemon ${name} has an ID of ${id} and starts with ${health} health points`;
}
