import { Roboto } from "next/font/google";
import Link from "next/link";
import styles from "./profile.module.css";
import { getPokemonId } from "~/helpers/pokemon";
import Team from "~/components/team/Team";
import { useState } from "react";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Loading from "~/components/Loading/Loading";
import { useSession } from "next-auth/react";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

type team = {
  name: string;
  pokemonId: number;
  type: string;
};

type UserInfo = {
  avatar: number;
  username: string;
  caughtPokemon: number[];
  trainerBadges: number[];
  level: number;
  team: team[];
};

const emptyUserObject: UserInfo = {
  avatar: 1,
  username: "Loading...",
  caughtPokemon: [],
  trainerBadges: [],
  level: 0,
  team: [],
};

export default function Profile() {
  const session = useSession();
  const [userInfo, setUserInfo] = useState<UserInfo>(emptyUserObject);
  const router = useRouter();
  const { isLoading } = api.pokemon.getUserInfo.useQuery(undefined, {
    onSuccess: (data) => {
      if (!data) return;
      if (data.avatar === 0 || data.username === "NO_USERNAME_YET") {
        void router.push("/setup");
        return;
      }
      setUserInfo({ ...data });
    },
    refetchOnWindowFocus: false,
    enabled: !!session.data?.user,
  });

  if (!session.data?.user) return <h1>You&apos;re not logged in</h1>;

  if (isLoading || userInfo.username === "Loading...") {
    return <Loading />;
  }

  return (
    <div className={`${checkStyleClass(styles.container)} ${roboto.className}`}>
      <h1>Profile</h1>
      <div className={styles.userCard}>
        <div className={styles.userInfoContainer}>
          <div className={styles.userInfo}>
            <p>@{userInfo.username}</p>
            <div className={styles.avatar}>
              <img
                src={`/assets/avatars/${getPokemonId(userInfo.avatar)}.png`}
                alt="avatar"
              />
            </div>
          </div>
          <div className={styles.userStats}>
            <div
              className={`${checkStyleClass(
                styles.caughtPokemon
              )} ${checkStyleClass(styles.level)}`}
            >
              <p>Level</p>
              <span>{userInfo.level}</span>
            </div>
            <div className={styles.caughtPokemon}>
              <p>Caught</p>
              <p>
                <span>{userInfo.caughtPokemon.length}</span>/905
              </p>
            </div>
            <div
              className={`${checkStyleClass(
                styles.caughtPokemon
              )} ${checkStyleClass(styles.badges)}`}
            >
              <p>Badges</p>
              <p>
                <span>{userInfo.trainerBadges.length}</span>/20
              </p>
            </div>
          </div>
        </div>
        <div className={styles.badgesCard}>
          <h2>Recent Badges</h2>
          <div className={styles.badgesContainer}>
            {userInfo.trainerBadges.map((badge: number) => (
              <div key={badge} className={styles.badge}>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/${badge}.png`}
                  alt="badge"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.teamCard}>
        <Link href="team">team &rarr;</Link>
        <p>Current Team</p>
        {userInfo.team.length ? (
          <Team
            team={userInfo.team}
            edit={false}
            teamCardStyles={checkStyleClass(styles.teamCardStyles)}
            teamCardImageStyles={checkStyleClass(styles.teamCardImageStyles)}
            teamMediaQueries={styles.teamMediaQueries}
          />
        ) : (
          <p>No team yet</p>
        )}
      </div>
    </div>
  );
}
