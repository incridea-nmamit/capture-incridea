import React from "react";
import styles from "./loader.module.css";

//currently default logo is kept
//reviewer if you see this make me remember to change to camera svg
//also change the bg-black to bg color scheme tht will be decided later

const CenteredLoader = () => {
  return (
    <div className="z-60 fixed inset-0 flex items-center justify-center bg-black">
      <div className={styles.loader}>
        <div className={styles.box}>
          <div className={styles.logo}>
            <img src="/images/Logo/capture-footer.png" width={50} height={50}></img>
          </div>
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
