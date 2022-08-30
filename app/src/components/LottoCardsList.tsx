import { FC } from 'react';

import { LottoResult } from '../types';
import { LottoCard } from './LottoCard';

import styles from './LottoCardsList.module.css';

interface LottoCardsProps {
  lottoResults: LottoResult[]
}

interface DateDividerProps {
  date: string;
}

interface LottoCardsListProps {
  date: string;
  lottoResults: LottoResult[];
}

export const LottoCardsList: FC<LottoCardsListProps> = ({ date, lottoResults }) =>
  <div>
    <DateDivider date={date} />
    <LottoCards lottoResults={lottoResults} />
  </div>


const LottoCards: FC<LottoCardsProps> = ({ lottoResults }) =>
  // filter here:
  //   1. add param search
  //   2. render only if in search
  <>{lottoResults.map(lottoResult => <LottoCard
    key={lottoResult.objectID}
    lottoResult={lottoResult}
  />)}</>


const DateDivider: FC<DateDividerProps> = ({ date }) => {
  const formattedDate = new Date(Date.parse(date)).toLocaleDateString(
    navigator.language,
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  )

  return <div className={styles.dateDivider}>{formattedDate}</div>
}