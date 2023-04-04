import styles from "./dashboard.module.css";
import { motion } from "framer-motion";
import { Roboto } from "next/font/google";
import Link from "next/link";
import { checkStyleClass } from "~/helpers/checkStyleClass";

const roboto = Roboto({
  weight: ["300"],
  subsets: ["latin"],
});

export default function Dashboard() {
  const links = [
    {
      link: "Team",
      color: "electricCardColor",
      img: "https://cdn-icons-png.flaticon.com/512/528/528098.png",
      linkInfo: "You can add and remove Pokemon from your current team",
    },
    {
      link: "Profile",
      color: "grass",
      img: "https://cdn-icons-png.flaticon.com/512/188/188989.png",
      linkInfo: "View your profile and change your settings",
    },
    {
      link: "Pokedex",
      color: "waterCardColor",
      img: "https://cdn-icons-png.flaticon.com/512/189/189001.png",
      linkInfo: "View all the pokemon you have caught",
    },
    {
      link: "Gyms",
      color: "ghostCardColor",
      img: "https://cdn-icons-png.flaticon.com/512/189/189003.png",
      linkInfo: "View all the gyms you have visited",
    },
    {
      link: "Forum",
      color: "psychic",
      img: "https://cdn-icons-png.flaticon.com/512/189/189006.png",
      linkInfo: "View the forum and post your own threads",
    },
  ];
  return (
    <motion.div
      className={`${checkStyleClass(styles.container)} ${roboto.className}`}
      initial={{ opacity: 0, translateX: "50px" }}
      animate={{ opacity: 1, translateX: "0" }}
    >
      <div className={styles.dashboardInfo}>
        <div className={styles.trainerInfo}>
          <h2>Greetings, Trainer!</h2>
          <p>
            Welcome to the world of Pokémon! Your goal is to become the greatest
            trainer by exploring regions, catching Pokémon, and battling Gym
            Leaders. Are you ready to catch em all and become a legend? Let the
            adventure begin!
          </p>
        </div>
        <div className={styles.avatar}>
          <img
            src="https://www.nicepng.com/png/full/62-622961_no-one-knows-if-people-eat-pokmon-png.png"
            alt=""
          />
        </div>
      </div>
      <div className={styles.links}>
        {links.map((el) => (
          <Link
            href={`/${el.link.toLowerCase()}`}
            className={`${checkStyleClass(styles.linkBox)} ${el.color}`}
            key={el.link}
          >
            <img src={el.img} />
            <div className={styles.linkInfo}>
              <h2>{el.link}</h2>
              <p>{el.linkInfo}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getServerSession(context.req, context.res, authOptions);
//   if (!session) {
//     return {
//       redirect: {
//         destination: "/pokedex",
//         permanent: false,
//       },
//     };
//   }
//   const data = await prisma.user.findUnique({
//     where: { id: session?.user.id },
//     select: {
//       username: true,
//       avatar: true,
//     },
//   });
//   if (!data?.username) {
//     return {
//       redirect: {
//         destination: "/setup",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: { username: data.username, avatar: data.avatar },
//   };
// };
