import { FC } from "react";

import styles from "./LottoBalls.module.css";
import { Skeleton } from "@mui/material";

interface LottoBallsProps {
  combinations: string[] | undefined[];
}

export const LottoBalls: FC<LottoBallsProps> = ({ combinations }) => (
  <section className={styles.lottoBallsContainer}>
    {combinations.map((number: string | undefined, index: number) =>
      number !== undefined ? (
        <span className={styles.numberCircle} key={index}>
          {zeroPad(parseInt(number), 2)}
        </span>
      ) : (
        <Skeleton
          key={index}
          variant="circular"
          width={40}
          height={40}
          sx={{ margin: "10px 2px" }}
        />
      )
    )}
  </section>
);

const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, "0");
