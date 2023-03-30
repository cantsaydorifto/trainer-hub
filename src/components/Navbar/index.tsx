import { Roboto } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import styles from "./navbar.module.css";

const roboto = Roboto({
  weight: ["300"],
  subsets: ["latin"],
});

const navLinks = [
  {
    name: "Home",
    path: "/dashboard",
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
        <img
          src="https://cdn-icons-png.flaticon.com/512/287/287226.png"
          alt=""
        />
      </div>
    </div>
  );
}
