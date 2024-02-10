import { FC } from "react";

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
} & (
  | {
      isLoading: true;
      lottoResult?: undefined;
    }
  | {
      isLoading: false;
      lottoResult: LottoResult;
    }
);

export const LottoCard: FC<LottoCardProps> = React.memo(
  ({ isFirst, isLoading, lottoResult }) => {
    const {
      lottoGame = "",
      jackpot = 0,
      combinations = [],
      winners = 0,
      drawDate = Timestamp.now(),
    } = isLoading ? {} : lottoResult;

    const formattedDate = drawDate
      .toDate()
      .toLocaleDateString(navigator.language, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    return (
      <Card
        elevation={0}
        sx={{
          backgroundColor: winners > 0 ? "#fffee0" : "#ffffff",
          borderRadius: "max(0px, min(8px, (100vw - 4px - 100%) * 9999)) / 8px",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.15)",
          display: "flex",
          marginBottom: "10px",
          marginTop: isFirst ? "10px" : "0px",
          width: "auto",
          maxWidth: "100vw",
        }}
      >
        {isLoading ? (
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
        ) : (
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
              {isLoading ? <Skeleton /> : lottoGame}
            </Typography>
            <Typography
              variant="body2"
              style={winners > 0 ? { fontWeight: "bold", color: "red" } : {}}
            >
              {isLoading ? (
                <Skeleton />
              ) : (
                <>
                  {winners}{" "}
                  {winners > 1 || winners === 0 ? "Winners" : "Winner"}
                </>
              )}{" "}
            </Typography>
            <LottoBalls isLoading={isLoading} combinations={combinations} />
            <Typography
              variant="h5"
              color="#26c281"
              style={{ backgroundColor: "inherit" }}
            >
              {isLoading ? (
                <Skeleton />
              ) : (
                jackpot.toLocaleString(undefined, {
                  style: "currency",
                  currency: "Php",
                  currencyDisplay: "narrowSymbol",
                  notation: "standard",
                })
              )}
            </Typography>
            <Typography variant="body2" style={{ backgroundColor: "inherit" }}>
              {isLoading ? <Skeleton /> : formattedDate}
            </Typography>
          </CardContent>
        </div>
      </Card>
    );
  }
);
