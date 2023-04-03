import { useSession } from "next-auth/react";
import { useState } from "react";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import { firstWorldCapital } from "~/helpers/firstWordCapital";
import { getPokemonId } from "~/helpers/pokemon";
import { api } from "~/utils/api";
import EditTeamModal from "../editTeam/EditTeamModal";
import styles from "./team.module.css";
import UpdateTeam from "./updateTeam";

type team = {
  name: string;
  pokemonId: number;
  type: string;
};

export default function Team({
  team,
  edit,
  teamCardStyles,
  teamCardImageStyles,
  teamMediaQueries,
}: {
  team: team[];
  edit: boolean;
  teamCardStyles: string;
  teamCardImageStyles: string;
  teamMediaQueries?: string;
}) {
  const session = useSession();

  const { mutate } = api.pokemon.removeFromTeam.useMutation();

  const [teamData, setTeamData] = useState(team);
  api.pokemon.getTeam.useQuery(undefined, {
    onSuccess: (el) => {
      setTeamData(el);
    },
    refetchOnWindowFocus: false,
    enabled: !!session.data?.user,
  });

  const [editModalToggle, setEditModalToggle] = useState(false);
  const [indexToAdd, setIndexToAdd] = useState(0);

  const toggle = () => setEditModalToggle((prev) => !prev);

  const addPokemon = (pokemon: team) => {
    setTeamData((prev) => {
      const temp = JSON.parse(JSON.stringify(prev)) as team[];
      temp[indexToAdd] = pokemon;
      return temp;
    });
  };

  const editTeamHandler = (pokemonId: number, idx: number) => {
    setIndexToAdd(idx);
    if (pokemonId === 0) {
      setEditModalToggle((prev) => !prev);
      return;
    }
    try {
      mutate(pokemonId);
      setTeamData((prev) => {
        const temp = JSON.parse(JSON.stringify(prev)) as team[];
        temp[temp.findIndex((el) => el.pokemonId === pokemonId)] = {
          name: "",
          pokemonId: 0,
          type: "",
        };
        return temp;
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div
        className={`${checkStyleClass(styles.team)} ${checkStyleClass(
          teamMediaQueries
        )}`}
      >
        {teamData.map((pokemon, idx) => (
          <div
            className={`${checkStyleClass(styles.pokemon)} ${teamCardStyles} ${
              pokemon.pokemonId === 0
                ? checkStyleClass(styles.addPokemonCardColor)
                : ` ${pokemon.type}CardColor`
            }`}
            key={`${pokemon.pokemonId}_${idx}`}
          >
            {edit && (
              <UpdateTeam
                key={pokemon.pokemonId}
                addPokemon={pokemon.pokemonId !== 0}
                onClick={() => editTeamHandler(pokemon.pokemonId, idx)}
              />
            )}
            {!!pokemon.pokemonId && (
              <img
                className={teamCardImageStyles}
                src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${getPokemonId(
                  pokemon.pokemonId
                )}.png`}
                alt={pokemon.name}
              />
            )}
            {edit && <p>{firstWorldCapital(pokemon.name)}</p>}
          </div>
        ))}
      </div>
      {editModalToggle && (
        <EditTeamModal addPokemon={addPokemon} toggle={toggle} />
      )}
    </>
  );
}
