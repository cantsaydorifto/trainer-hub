import { useSession } from "next-auth/react";
import Team from "~/components/team/Team";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import styles from "./team.module.css";

type team = {
  name: string;
  pokemonId: number;
  type: string;
};

export default function TeamPage() {
  const session = useSession();
  if (!session.data?.user) return <h1>You&apos;re not logged in</h1>;
  const team: team[] = [];
  for (let i = 0; i < 6; i++)
    team.push({
      name: "",
      pokemonId: 0,
      type: "",
    });
  return (
    <div className={styles.pageContainer}>
      <h1>Your Team</h1>
      <div className={styles.teamContainer}>
        <Team
          team={team}
          edit={true}
          teamCardStyles={checkStyleClass(styles.teamCardStyles)}
          teamCardImageStyles={checkStyleClass(styles.teamCardImageStyles)}
        />
      </div>
    </div>
  );
}
