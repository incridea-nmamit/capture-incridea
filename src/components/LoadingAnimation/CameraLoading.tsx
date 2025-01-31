import React from "react";
import styles from "./loader.module.css";

const CenteredLoader = () => {
  return (
    <div className={styles.fullscreen}>
      <div className={styles.loader}>
        <div className={styles.box}>
          {/* <div className={styles.logo}>
          <img src="" width={50} height={50}></img>
          </div> */}
        </div>
        <div className={styles.box}></div>
        <div className={styles.box}></div>
        <div className={styles.box}></div>
        <div className={styles.box}></div>
      </div>
    </div>
  );
};

export default CenteredLoader;
