import axios from "axios";

type Response = {
  name: string;
  url: string;
};

type PokemonData = {
  id: number;
  name: string;
  types: [{ type: { name: string } }];
  abilities: [{ ability: { name: string } }];
  height: number;
  weight: number;
  stats: [
    {
      base_stat: number;
      stat: {
        name: string;
      };
    }
  ];
};

type species = {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
};

type PokemonNames = {
  next: string | null;
  previous: string | null;
  results: Response[];
};

export const getPokemonNames = (page: number) => {
  const offset = 20 * (page - 1);
  return axios.get<PokemonNames>(
    `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${20}`
  );
};

export const getPokemonData = (res: Response[]) => {
  return Promise.all(res.map((el) => axios.get<PokemonData>(el.url)));
};

export const getOnePokemon = (id: string) => {
  const prom1 = axios.get<PokemonData>(
    `https://pokeapi.co/api/v2/pokemon/${id}`
  );
  const prom2 = axios.get<species>(
    `https://pokeapi.co/api/v2/pokemon-species/${id}`
  );
  return Promise.all([prom1, prom2]);
};

export const getPokemonId = (id: number | string) => {
  const str = `00${id}`;
  return str.slice(-3);
};
