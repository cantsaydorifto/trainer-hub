import { useState } from "react";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import { getPokemonId } from "~/helpers/pokemon";
import { api } from "~/utils/api";
import Modal from "../Modal/Modal";
import styles from "./modal.module.css";

type props = {
  trainer: {
    name: string;
    id: number;
    img: string;
    type: string;
    badge: string;
    leader: string;
    team: {
      id: number;
      name: string;
    }[];
  };
  toggleModal: () => void;
  setBadge: React.Dispatch<React.SetStateAction<number[]>>;
  badge: number[];
  isLoading: boolean;
};

export default function GymModal({
  toggleModal,
  trainer,
  badge,
  setBadge,
  isLoading,
}: props) {
  console.log(trainer);

  const { mutate, isLoading: addingBadge } =
    api.pokemon.addBadges.useMutation();

  const gymDefeatHandler = () => {
    mutate(trainer.id);
    setBadge((prev) => [...prev, trainer.id]);
  };
  return (
    <Modal
      modalContent={`${trainer.type}CardColor ${checkStyleClass(
        styles.content
      )}`}
      toggleModal={toggleModal}
    >
      <div className={styles.trainer}>
        <div className={styles.gymInfo}>
          <div className={styles.trainerCard}>
            <img src={trainer.img} alt={trainer.name} />
            <h2>{trainer.leader}</h2>
          </div>
          <div className={`${checkStyleClass(styles.badgeInfo)}`}>
            <div>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/${trainer.id}.png`}
                alt="badge"
              />
            </div>
            <p>{trainer.badge}</p>
          </div>
        </div>
        {!badge.includes(trainer.id) ? (
          <button
            disabled={isLoading || addingBadge}
            onClick={gymDefeatHandler}
            className={styles.battle}
          >
            Battle
            <img
              src="https://cdn-icons-png.flaticon.com/512/934/934427.png"
              alt="battle"
            />
          </button>
        ) : (
          <p className={styles.recievedBadge}>You have the {trainer.badge}</p>
        )}
      </div>
      <div className={styles.team}>
        {trainer.team.map((pokemon, idx) => (
          <div
            className={`${checkStyleClass(styles.pokemon)} ${trainer.type}`}
            key={`${pokemon.id} ${idx}`}
          >
            <img
              src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${getPokemonId(
                pokemon.id
              )}.png`}
              alt={pokemon.name}
            />
            <p>{pokemon.name}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
}
