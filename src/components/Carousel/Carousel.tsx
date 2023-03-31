import styles from "./carousel.module.css";
import { carouselData } from "./data";

export default function Carousel() {
  return (
    <div className={styles.carousel}>
      <div className={styles.carouselContent}>
        {carouselData.map((el) => (
          <div key={el.id} className={styles.carouselImageContainer}>
            <img src={el.link} alt="pokemon" />
          </div>
        ))}
        {carouselData.map((el) => (
          <div key={el.id} className={styles.carouselImageContainer}>
            <img src={el.link} alt="pokemon" />
          </div>
        ))}
      </div>
    </div>
  );
}
