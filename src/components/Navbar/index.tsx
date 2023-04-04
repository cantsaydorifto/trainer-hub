import { Roboto } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import styles from "./navbar.module.css";
import { signIn, useSession } from "next-auth/react";

const roboto = Roboto({
  weight: ["300"],
  subsets: ["latin"],
});

const navLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Team",
    path: "/team",
  },
  {
    name: "Search",
    path: "/pokedex/search",
  },
  {
    name: "Gyms",
    path: "/gyms",
  },
];

const UserImage = () => {
  const session = useSession();
  if (session.status === "unauthenticated") {
    return (
      <button onClick={() => signIn()} className={styles.login}>
        Log In
      </button>
    );
  }
  if (session.status === "loading") return null;
  if (session.status === "authenticated") {
    if (!session.data.user.image || session.data.user.image.trim() === "") {
      return (
        <Link href="/profile">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3899/3899618.png"
            alt=""
          />
        </Link>
      );
    }
    return (
      <Link href="/profile">
        <img src={`${session.data.user.image}`} alt="" />
      </Link>
    );
  }
  return null;
};

export default function Navbar() {
  const router = useRouter();
  return (
    <div className={`${roboto.className} ${checkStyleClass(styles.navbar)}`}>
      <div className={styles.logo}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1752/1752681.png"
          alt=""
        />
        <h1>Trainer Hub</h1>
      </div>
      <nav>
        <ul>
          {navLinks.map((el) => (
            <li
              key={el.path}
              className={
                router.pathname.startsWith(el.path) ? styles.selectedLink : ""
              }
            >
              <Link href={el.path}>{el.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.userImage}>
        <UserImage />
      </div>
    </div>
  );
}
