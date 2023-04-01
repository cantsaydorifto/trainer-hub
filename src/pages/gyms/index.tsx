import Link from "next/link";
import React from "react";
import { firstWorldCapital } from "~/helpers/firstWordCapital";
import styles from "./regions.module.css";

export default function Region() {
  const pokemonRegions = [
    {
      name: "Kanto",
      id: 1,
      img: "https://wallpaperaccess.com/full/1120106.jpg",
    },
    {
      name: "Johto",
      id: 2,
      img: "https://wallpaperaccess.com/full/175726.jpg",
    },
    {
      name: "Hoenn",
      id: 3,
      img: "https://wallpaperaccess.com/full/175724.jpg",
    },
    {
      name: "Sinnoh",
      id: 4,
      img: "https://wallpaperaccess.com/full/175037.jpg",
    },
  ];
  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        {pokemonRegions.map((region) => (
          <Link
            href={`gyms/${firstWorldCapital(region.name).toLowerCase()}`}
            key={region.id}
            className={styles.regionCard}
          >
            <img src={region.img} alt={region.name} />
            <h2 className={styles.regionName}>{region.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
