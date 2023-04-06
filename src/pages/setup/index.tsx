import { motion } from "framer-motion";
import { Roboto } from "next/font/google";
import React, { useRef, useState } from "react";
import styles from "./setup.module.css";
import { getPokemonId } from "~/helpers/pokemon";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "~/components/Loading/Loading";

const roboto = Roboto({
  weight: "300",
  subsets: ["latin"],
});

export default function Setup() {
  const session = useSession();
  const [step, setStep] = useState(0);
  const [starter, setStarter] = useState(0);
  const [avatar, setAvatar] = useState(1);
  const name = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [showPage, setShowPage] = useState(false);

  const router = useRouter();

  const { mutate: addUserInfo } = api.pokemon.addUserInfo.useMutation();
  const { mutate, isLoading } =
    api.pokemon.checkUsernameAvailability.useMutation({
      onSuccess: (data) => {
        if (!data) {
          setUsername("");
          alert("Username already taken");
        } else {
          setUsername(checkStyleClass(name.current?.value));
          alert("Username available");
        }
      },
    });

  api.pokemon.getUserInfo.useQuery(undefined, {
    onSuccess: (data) => {
      if (data.username !== "NO_USERNAME_YET") {
        void router.push("/");
      } else {
        setShowPage(true);
      }
    },
    enabled: session.status === "authenticated",
  });

  if (session.status === "unauthenticated") {
    return <h1>Not Logged In</h1>;
  }

  if (session.status === "loading" || !showPage) {
    return <Loading />;
  }

  const checkUsername = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const username = name.current?.value;
    if (!username) return;
    mutate(username);
  };

  const infoHandler = () => {
    const starterId = starterData[starter]?.id;
    if (!starterId) {
      alert("Select a starter");
      return;
    }
    addUserInfo(
      { username, avatar, starter: starterId },
      {
        onSuccess: () => {
          void router.push("/profile");
        },
        onError: () => {
          alert("Something went wrong, try again");
        },
      }
    );
  };

  const starterData = [
    {
      name: "Bulbasaur",
      img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
      type: "grass",
      id: 1,
    },
    {
      name: "Charmander",
      img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
      type: "fire",
      id: 4,
    },
    {
      name: "Squirtle",
      img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
      type: "water",
      id: 7,
    },
  ];
  const dialogue = [
    "Welcome to the world of Pokémon!, My name is Oak! People call me the Pokémon Prof!",
    "This world is inhabited by creatures called Pokémon! For some people, Pokémon are pets. Others use them for fights. Myself... I study Pokémon as a profession.",
    "First, what is your name?",
    `Right! So your name is ${username}`,
    `There are 3 types of Pokémon: Grass, Fire, and Water. Each type has strengths and weaknesses. For example, Grass is weak against Fire, and Fire is weak against Water`,
    `Choose your starter Pokémon!`,
    `So you chose ${checkStyleClass(starterData[starter]?.name)}!`,
    `Now lets choose an avatar!`,
    `Your very own POKEMON legend is about to unfold! A world of dreams and adventures with POKEMON awaits! Let's go!`,
  ];
  return (
    showPage && (
      <div
        className={`${checkStyleClass(styles.container)} ${roboto.className}`}
      >
        <div className={styles.oakContainer}>
          {step > 0 ? (
            <button
              style={{
                rotate: "180deg",
                left: "0",
              }}
              className="arrow"
              onClick={() => setStep((prev) => prev - 1)}
            ></button>
          ) : (
            <button
              onClick={() => null}
              disabled={true}
              style={{
                rotate: "180deg",
                left: "0",
                cursor: "default",
                opacity: 0,
              }}
              className="arrow"
            ></button>
          )}
          {step !== 7 ? (
            <motion.div layout className={styles.oak}>
              {![2, 5, 6].includes(step) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className={styles.imgContainer}
                >
                  <img src="/assets/oak.png" alt="Professor Oak" />
                </motion.div>
              )}
              {step === 5 && (
                <div className={styles.starterContainer}>
                  {starterData.map((poke, idx) => (
                    <div
                      className={`${checkStyleClass(styles.starter)} ${
                        poke.type
                      }CardColor`}
                      onClick={() => setStarter(idx)}
                      style={{
                        border:
                          starter === idx
                            ? "2px solid black"
                            : "2px solid white",
                      }}
                      key={poke.id}
                    >
                      <img src={`${poke.img}`} alt={`${poke.name}`} />
                      <p>{poke.name}</p>
                    </div>
                  ))}
                </div>
              )}
              {step === 6 && (
                <motion.div layout className={styles.starterContainer}>
                  <div
                    className={`${checkStyleClass(
                      styles.starter
                    )} ${checkStyleClass(starterData[starter]?.type)}CardColor`}
                    style={{
                      border: "2px solid white",
                    }}
                  >
                    <img
                      src={`${checkStyleClass(starterData[starter]?.img)}`}
                      alt={`${checkStyleClass(starterData[starter]?.name)}`}
                    />
                    <p>{starterData[starter]?.name}</p>
                  </div>
                </motion.div>
              )}
              <motion.div layout className={styles.dialogue}>
                {step !== 2 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    key={step}
                    animate={{ opacity: 1 }}
                    className={styles.dialogueText}
                  >
                    {dialogue[step]}
                  </motion.p>
                ) : (
                  <label className={styles.dialogueText} htmlFor="username">
                    {dialogue[step]}
                  </label>
                )}
                {step === 2 && (
                  <div className={styles.usernameContainer}>
                    <label htmlFor="username">Enter Your Username</label>
                    <input
                      className={styles.username}
                      id="username"
                      type="text"
                      maxLength={15}
                      ref={name}
                    />
                    <button disabled={isLoading} onClick={checkUsername}>
                      Check Username
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1>Choose An Avatar</h1>
              <motion.div className={styles.avatarContainer}>
                <div className={styles.avatarChangeButtonContainer}>
                  {avatar > 1 ? (
                    <button
                      style={{ rotate: "180deg" }}
                      onClick={() => setAvatar((prev) => prev - 1)}
                      className="arrow"
                    ></button>
                  ) : (
                    <button
                      style={{ opacity: 0, cursor: "default" }}
                      disabled={true}
                      onClick={() => null}
                      className="arrow"
                    ></button>
                  )}
                  <span>#{getPokemonId(avatar).slice(1)}</span>
                  {avatar < 20 ? (
                    <button
                      onClick={() => setAvatar((prev) => prev + 1)}
                      className="arrow"
                    ></button>
                  ) : (
                    <button
                      style={{ opacity: 0, cursor: "default" }}
                      disabled={true}
                      onClick={() => null}
                      className="arrow"
                    ></button>
                  )}
                </div>
                <div key={avatar} className={styles.avatarImgContainer}>
                  <img src={`/assets/avatars/${getPokemonId(avatar)}.png`} />
                </div>
              </motion.div>
            </motion.div>
          )}
          {step !== 2 ? (
            <>
              {step !== 8 ? (
                <button
                  style={{ right: "0" }}
                  className="arrow"
                  onClick={() => setStep((prev) => prev + 1)}
                ></button>
              ) : (
                <button
                  className={`arrow ${checkStyleClass(styles.getStarted)}`}
                  style={{ right: "0" }}
                  onClick={infoHandler}
                ></button>
              )}
            </>
          ) : (
            username !== "" && (
              <button
                style={{ right: "0" }}
                className="arrow"
                onClick={() => setStep((prev) => prev + 1)}
              ></button>
            )
          )}
        </div>
      </div>
    )
  );
}
