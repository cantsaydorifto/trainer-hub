import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";

const useCaughtPokemon = () => {
  const [caughtPokemon, setCaughtPokemon] = useState<number[]>([]);
  const session = useSession();
  api.pokemon.getAll.useQuery(undefined, {
    onSuccess: (el) => {
      setCaughtPokemon(el);
    },
    enabled: !!session.data?.user,
    refetchOnWindowFocus: false,
  });

  const { mutate: catchPokemon, isLoading: isCatching } =
    api.pokemon.catch.useMutation();
  const { mutate: releasePokemon, isLoading: isReleasing } =
    api.pokemon.release.useMutation();

  const caughtHandler = (id: number) => {
    if (caughtPokemon.includes(id)) {
      setCaughtPokemon((prev) => [...prev.filter((el) => el !== id)]);
      releasePokemon(id);
    } else {
      setCaughtPokemon((prev) => [...prev, id]);
      catchPokemon(id);
    }
  };

  return {
    caughtPokemon,
    caughtHandler,
    isReleasing,
    isCatching,
    session,
  };
};

export default useCaughtPokemon;
