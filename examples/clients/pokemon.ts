export interface Attack {
  name: string;
  damage: number;
}

export interface Pokemon {
  id: string;
  name: string;
  img: { alt: string; src: string };
  health: number;
  attacks: Attack[];
}

export class PokemonClient {
  get(id: string): Promise<Pokemon> {
    const pokemon = stubPokemon({ id });
    return new Promise((resolveWith) => {
      resolveWith(pokemon);
    });
  }

  list(): Promise<Pokemon[]> {
    const pokemon = [
      stubPokemon({ id: "1" }),
      stubPokemon({ id: "2" }),
      stubPokemon({ id: "3" }),
    ];

    return new Promise((resolveWith) => {
      resolveWith(pokemon);
    });
  }
}

function stubPokemon(overrides: Partial<Pokemon> = {}): Pokemon {
  return {
    id: "1",
    name: "Bulbasaur",
    img: { alt: "Bulbasaur", src: "https://..." },
    health: 100,
    attacks: [
      { name: "Tackle", damage: 10 },
      { name: "Vine Whip", damage: 20 },
    ],
    ...overrides,
  };
}
