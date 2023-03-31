import { useQuery } from "@tanstack/react-query";
import { getPokemonData, getPokemonNames } from "~/helpers/pokemon";

const usePokemonData = (page: number) => {
  const { data } = useQuery(["pokemon", page], () => getPokemonNames(page), {
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });
  const res = data?.data.results || [];
  const prevPageUrl = data?.data.previous;
  const nextPageUrl = data?.data.next;

  const { isLoading, data: pokemonData } = useQuery(
    ["pokemon", res],
    () => getPokemonData(res),
    {
      enabled: !!res,
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  );
  const pokeData = pokemonData?.map((el) => el.data);
  return {
    pokeData,
    isLoading,
    prevPageUrl: prevPageUrl ? prevPageUrl : null,
    nextPageUrl: nextPageUrl ? nextPageUrl : null,
  };
};

export default usePokemonData;
