import { FC, useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import { LottoResult } from "../../utils/types";
import { LottoBalls } from "./LottoBalls";

import styles from "./LottoCard.module.css";
import { getLottoIcon } from "../../utils/icon-helper";
import React from "react";
import { Skeleton } from "@mui/material";
import { Timestamp } from "firebase/firestore";

type LottoCardProps = {
  isFirst: boolean;
  lottoResult?: LottoResult;
};

type LottoCardSubHeaderProps = {
  winners: number | undefined;
  showWaitingForResults?: boolean;
};

type LottoCardJackpotProps = {
  jackpot: number | undefined;
};

export const LottoCard: FC<LottoCardProps> = React.memo(
  ({ isFirst, lottoResult }) => {
    const { lottoGame, combinations, jackpot, winners, drawDate } =
      lottoResult ?? {};

    const formattedDate = drawDate
      ? drawDate.toDate().toLocaleDateString(navigator.language, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : undefined;

    return (
      <Card
        elevation={0}
        sx={{
          backgroundColor: (winners || 0) > 0 ? "#fffee0" : "#ffffff",
          borderRadius: "max(0px, min(8px, (100vw - 4px - 100%) * 9999)) / 8px",
          border: "thin solid #DFE6E9",
          display: "flex",
          marginBottom: "10px",
          marginTop: isFirst ? "10px" : "0px",
          width: "auto",
          maxWidth: "100vw",
        }}
      >
        {lottoGame !== undefined ? (
          <CardMedia
            image={getLottoIcon(lottoGame)}
            sx={{
              backgroundSize: "contain",
              height: "auto",
              width: "70px",
              margin: {
                xs: "10px",
                sm: "20px",
              },
            }}
          />
        ) : (
          <Skeleton
            variant="rounded"
            sx={{
              height: "auto",
              width: "70px",
              margin: {
                xs: "10px",
                sm: "20px",
              },
            }}
          />
        )}
        <div className={styles.cardDetails}>
          <CardContent
            className={styles.cardContent}
            sx={{
              padding: "8px",
              "&: last-child": {
                paddingBottom: "8px",
              },
            }}
          >
            <Typography variant="h6">
              {lottoGame ? lottoGame : <Skeleton />}
            </Typography>

            <LottoCardSubHeader
              winners={winners}
              showWaitingForResults={true}
            />

            {combinations ? (
              <LottoBalls combinations={combinations} />
            ) : (
              <LottoBalls combinations={Array(6).fill(undefined)} />
            )}

            <LottoCardJackpot jackpot={jackpot} />

            <Typography variant="body2" style={{ backgroundColor: "inherit" }}>
              {formattedDate ? formattedDate : <Skeleton />}
            </Typography>
          </CardContent>
        </div>
      </Card>
    );
  }
);

const LottoCardSubHeader: FC<LottoCardSubHeaderProps> = ({
  winners,
  showWaitingForResults,
}) => {
  const subHeader =
    winners === undefined
      ? "Waiting for the draw result..."
      : winners === 1
        ? `${winners} Jackpot winner`
        : `${winners} Jackpot winners`;

  return (
    <Typography
      variant="body2"
      style={
        winners === undefined
          ? { fontStyle: "italic" }
          : winners > 0
            ? { fontWeight: "bold", color: "red" }
            : {}
      }
    >
      {winners === undefined && !showWaitingForResults ? (
        <Skeleton sx={{ maxWidth: "75%" }} />
      ) : (
        <>{subHeader}</>
      )}
    </Typography>
  );
};

const LottoCardJackpot: FC<LottoCardJackpotProps> = ({ jackpot }) => {
  return (
    <Typography
      variant="h5"
      color="#118C4F"
      style={{ backgroundColor: "inherit" }}
    >
      {jackpot !== undefined ? (
        jackpot.toLocaleString(undefined, {
          style: "currency",
          currency: "Php",
          currencyDisplay: "narrowSymbol",
          notation: "standard",
        })
      ) : (
        <Skeleton sx={{ maxWidth: "85%" }} />
      )}
    </Typography>
  );
};
