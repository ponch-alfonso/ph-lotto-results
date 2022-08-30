import { FC } from 'react';

import styles from './LottoBalls.module.css';

interface LottoBallsProps {
  combinations: string[];
}

export const LottoBalls: FC<LottoBallsProps> = ({ combinations }) =>
  <div className={styles.lottoBallsContainer}>
    {
      // Using index as key here is not ideal, but this array 
      // should not change so this should suffice.
      combinations.map((number: string, index: number) =>
        <div className={styles.lottoBall} key={index}>
          {zeroPad(parseInt(number), 2)}
        </div>
      )
    }
  </div>

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')