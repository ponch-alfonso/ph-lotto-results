import { FC } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { LottoResult } from '../../utils/types';
import { LottoBalls } from './LottoBalls';

import styles from './LottoCard.module.css';
import { getLottoIcon } from '../../utils/icon-helper';

interface LottoCardProps {
  isFirst: boolean
  lottoResult: LottoResult
}

// TODO: Highlight card if has winner
export const LottoCard: FC<LottoCardProps> = ({ isFirst, lottoResult: { lottoGame, jackpot, combinations, winners, drawDate } }) => {
  const formattedDate = drawDate.toDate().toLocaleDateString(
    navigator.language,
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );
  
  // TODO: make contents responsive
  return (
    <Card elevation={0}
      sx={{
        backgroundColor: winners > 0 ? "#fffee0" : "#ffffff",
        borderRadius: 'max(0px, min(8px, (100vw - 4px - 100%) * 9999)) / 8px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        marginBottom: '10px',
        marginTop: isFirst ? '10px' : '0px',
        width: 'auto',
        maxWidth: '100vw',
      }}
    >
      <CardMedia
        image={getLottoIcon(lottoGame)}
        sx={{
          backgroundSize: 'contain',
          height: 'auto',
          width: {
            xs: '70px',
            sm: '150px',
          },
          margin: {
            xs: '10px',
            sm: '20px',
          }
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
          <Typography variant="h6">
            {lottoGame}
          </Typography>
          <Typography variant="body2" style={winners > 0 ? { fontWeight: 'bold', color: 'red' } : {}}>
            {winners} {winners > 1 || winners === 0 ? 'Winners' : 'Winner'}
          </Typography>
          <LottoBalls combinations={combinations} />
          <Typography variant="h5" component='body' color="#26c281" style={{ backgroundColor: 'inherit' }}>
            {jackpot.toLocaleString(undefined, {
              style: 'currency',
              currency: 'Php',
              currencyDisplay: 'narrowSymbol',
              notation: 'standard',
            })}
          </Typography>
          <Typography variant="body2" component='body' style={{ backgroundColor: 'inherit' }}>
            {formattedDate}
          </Typography>
        </CardContent >
      </div >
    </Card >
  )
}
