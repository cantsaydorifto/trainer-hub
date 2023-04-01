import { motion } from "framer-motion";
import { Roboto } from "next/font/google";
import { checkStyleClass } from "~/helpers/checkStyleClass";
import styles from "./modal.module.css";

const modalHandler = (
  e: React.MouseEvent<HTMLDivElement>,
  toggleModal: () => void
) => {
  if (e.target === e.currentTarget) toggleModal();
};

const roboto = Roboto({
  weight: ["300"],
  subsets: ["latin"],
});

type modalProps = {
  modalContent: string | undefined;
  toggleModal: () => void;
  children: React.ReactNode;
};

export default function Modal(props: modalProps) {
  return (
    <div
      onClick={(event) => modalHandler(event, props.toggleModal)}
      className={`${checkStyleClass(styles.overlay)} ${roboto.className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0, transition: { duration: 0.15 } }}
        className={`${checkStyleClass(styles.content)} ${checkStyleClass(
          props.modalContent
        )}`}
      >
        {props.children}
      </motion.div>
    </div>
  );
}
