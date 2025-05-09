import React, { FC } from "react";
import { RiMoneyRupeeCircleFill, RiMoneyRupeeCircleLine } from "react-icons/ri";
import styles from "./Loader.module.css";
import { LoaderProps } from "../component.types";

const Loader: FC<LoaderProps> = ({
  show,
  loadingMessage = "Loading...",
}) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.flipFlop}>
          <RiMoneyRupeeCircleFill className={styles.icon} />
          <RiMoneyRupeeCircleLine className={styles.icon} />
        </div>
        {loadingMessage && <p className={styles.message}>{loadingMessage}</p>}
      </div>
    </div>
  );
};

export default Loader;
