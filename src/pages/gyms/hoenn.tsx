import { useState } from "react";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import GymModal from "~/components/gymModal";
import styles from "./gym styles/gyms.module.css";
import { hoenn, skeletonData } from "~/helpers/region-data";
import { api } from "~/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Hoenn() {
  const [badge, setBadge] = useState<number[]>([]);
  const session = useSession();

  const { isLoading } = api.pokemon.getBadges.useQuery(undefined, {
    onSuccess: (el) => {
      setBadge(el);
    },
    refetchOnWindowFocus: false,
    enabled: !!session.data?.user,
  });
  console.log(isLoading);
  const [gymToggle, setGymToggle] = useState<{
    toggle: boolean;
    modalData: typeof hoenn[0];
  }>({
    toggle: false,
    modalData: hoenn[0] || skeletonData,
  });

  const toggleModal = () => {
    setGymToggle((prev) => {
      return { ...prev, toggle: !prev.toggle };
    });
  };

  return (
    <>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        HOENN
      </motion.h1>
      <motion.div
        initial={{ translateX: "-100px", opacity: 0 }}
        animate={{ translateX: "0px", opacity: 1 }}
        className={styles.container}
      >
        {hoenn.map((gym) => (
          <div
            className={`${checkStyleClass(styles.gymCard)} ${gym.type}`}
            onClick={() => {
              setGymToggle((prev) => {
                return {
                  ...prev,
                  modalData: gym,
                  toggle: !prev.toggle,
                };
              });
            }}
            key={gym.id}
          >
            <img className={styles.trainer} src={gym.img} alt={gym.name} />
            <h2>{gym.name}</h2>
            <p className={styles.gymBadge}>{gym.badge}</p>
          </div>
        ))}
      </motion.div>
      <AnimatePresence>
        {gymToggle.toggle && (
          <GymModal
            setBadge={setBadge}
            badge={badge}
            isLoading={isLoading}
            trainer={gymToggle.modalData}
            toggleModal={toggleModal}
          />
        )}
      </AnimatePresence>
    </>
  );
}