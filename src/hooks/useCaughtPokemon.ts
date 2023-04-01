import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

const useCaughtPokemon = () => {
  const session = useSession();

  const { mutate: catchPokemon, isLoading: isCatching } =
    api.pokemon.catch.useMutation();
  const { mutate: releasePokemon, isLoading: isReleasing } =
    api.pokemon.release.useMutation();

  return { catchPokemon, releasePokemon, isReleasing, isCatching, session };
};

export default useCaughtPokemon;
