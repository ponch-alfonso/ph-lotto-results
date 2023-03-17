import { FC } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { LottoResult } from '../types';
import { LottoBalls } from './LottoBalls';

import styles from './LottoCard.module.css';

import lotto_6_42 from './../assets/lotto_6_42.png';
import lotto_6_55 from './../assets/lotto_6_55.png';
import lotto_6_58 from './../assets/lotto_6_58.png';
import lotto_6_45 from './../assets/lotto_6_45.png';
import lotto_6_49 from './../assets/lotto_6_49.png';
import no_image_available from './../assets/no_image_availabe.png'

interface LottoCardProps {
  lottoResult: LottoResult
}

const ICON_MAPPING: { [key: string]: string } = {
  'Ultra Lotto 6/58': lotto_6_58,
  'Megalotto 6/45': lotto_6_45,
  'Superlotto 6/49': lotto_6_49,
  'Lotto 6/42': lotto_6_42,
  'Grand Lotto 6/55': lotto_6_55,
}

export const LottoCard: FC<LottoCardProps> = ({ lottoResult: { lottoGame, jackpot, combinations, winners } }) =>
  <Card className={styles.lottoCard} elevation={0}>
    <CardMedia
      className={styles.lottoIcon}
      image={getIcon(lottoGame)}
      sx={{
        backgroundSize: 'contain',
      }}
    />
    <div className={styles.cardDetails}>
      <CardContent
        className={styles.cardContent}
        sx={{
          padding: '8px',
          "&: last-child": {
            paddingBottom: '8px',
          }
        }}
      >
        <Typography variant="body1">
          {lottoGame}
        </Typography>
        <Typography variant="h5" color="#26c281">
          {jackpot.toLocaleString(undefined, {
            style: 'currency',
            currency: 'Php',
            currencyDisplay: 'narrowSymbol',
            notation: 'compact',
          })}
        </Typography>
        <LottoBalls combinations={combinations} />

      </CardContent >
    </div >
  </Card >


const getIcon = (lottoGame: string): string => {
  let icon = undefined;
  if (lottoGame in ICON_MAPPING) {
    icon = ICON_MAPPING[lottoGame]
  } else {
    icon = no_image_available;
  }
  return icon
}