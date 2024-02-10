import { FC } from "react";

import styles from "./LottoBalls.module.css";
import { Skeleton } from "@mui/material";

interface LottoBallsProps {
  isLoading: boolean;
  combinations: string[];
}

const DEFAULT_LOTTO_BALLS = 6;

export const LottoBalls: FC<LottoBallsProps> = ({
  isLoading,
  combinations,
}) => (
  <section className={styles.lottoBallsContainer}>
    {isLoading
      ? [...Array(DEFAULT_LOTTO_BALLS)].map((_, i) => (
          <Skeleton
            key={i}
            variant="circular"
            width={40}
            height={40}
            sx={{ margin: "10px 2px" }}
          />
        ))
      : // Using index as key here is not ideal, but this array
        // should not change so this should suffice.
        combinations.map((number: string, index: number) => (
          <span className={styles.numberCircle} key={index}>
            {zeroPad(parseInt(number), 2)}
          </span>
        ))}
  </section>
);

const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");
