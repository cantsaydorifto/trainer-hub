import axios from "axios";
import { api } from "~/utils/api";
import Modal from "../Modal/Modal";
import SearchBar from "../searchBar/Searchbar";
import styles from "./editTeamModal.module.css";

type pokeInfo = { id: number; name: string };

type team = {
  name: string;
  pokemonId: number;
  type: string;
};

type props = {
  toggle: () => void;
  addPokemon: (pokemon: team) => void;
};

export default function EditTeamModal({ addPokemon, toggle }: props) {
  const { mutate } = api.pokemon.addToTeam.useMutation();
  const clickHandler = async (pokeInfo: pokeInfo) => {
    toggle();
    try {
      const res = await axios.get<{ types: { type: { name: string } }[] }>(
        `https://pokeapi.co/api/v2/pokemon/${pokeInfo.id}`
      );
      const pokemon = {
        name: pokeInfo.name,
        type: res.data.types[0] ? res.data.types[0].type.name : "",
        pokemonId: pokeInfo.id,
      };
      mutate(pokemon);
      addPokemon(pokemon);
    } catch (err) {
      console.log(err);
    }
  };
  const condition = { isLink: false, clickHandler };
  return (
    <Modal modalContent={styles.content} toggleModal={toggle}>
      <p>Select Pokemon</p>
      <SearchBar condition={condition} />
    </Modal>
  );
}
