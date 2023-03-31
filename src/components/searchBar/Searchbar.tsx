import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import styles from "./searchbar.module.css";
import allPoke from "./searchBarData";
import ConditionalWrapper from "./conditionalWrapper";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import { getPokemonId } from "~/helpers/pokemon";

type SearchDataPokemon = {
  name: string;
  id: number;
};

type props = {
  condition: { isLink: boolean; clickHandler: (() => void) | null };
};

function SearchBar({ condition }: props) {
  const [inputData, setInputData] = useState("");
  const [filterData, setFilterData] = useState<SearchDataPokemon[]>([]);

  const pokeData = useMemo(
    () =>
      allPoke.map((el, idx) => {
        return {
          name: el.toLowerCase(),
          id: idx + 1,
        };
      }),
    []
  );

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(event.target.value);
    const searchQuery = event.target.value;
    const arr = pokeData.filter((el) => {
      return el.name.includes(searchQuery);
    });
    setFilterData(arr);
  };

  return (
    <div className={styles.searchBar}>
      <input type="text" onChange={changeHandler} />
      {inputData && filterData.length !== 0 && (
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className={styles.searchResult}
        >
          {filterData.slice(0, 5).map((el) => {
            return (
              <ConditionalWrapper
                searchResult={checkStyleClass(styles.pokemon)}
                pokeInfo={el}
                key={el.id}
                condition={condition}
              >
                <img
                  src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${getPokemonId(
                    el.id
                  )}.png`}
                  alt=""
                />
                <p>
                  {`#${getPokemonId(el.id)} `}
                  {el.name[0] && el.name[0].toUpperCase() + el.name.slice(1)}
                </p>
              </ConditionalWrapper>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

export default SearchBar;
