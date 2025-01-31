import React from "react";
import styles from "./CustomButton.module.css";
import { useRouter } from "next/router";

const CustomButton: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/captures"); // Navigates to the 'captures' page
  };

  return (
    <button className={styles.button} onClick={handleClick}>
      <div className={styles.dots_border}></div>

      <span className={styles.text_button}>Go to Captures</span>
    </button>
  );
};

export default CustomButton;
