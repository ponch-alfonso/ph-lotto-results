import { firestore } from "firebase-admin";

export interface LottoResult {
  objectID: number;
  lottoGame: string;
  combinations: string[];
  drawDate: firestore.Timestamp;
  jackpot: number;
  winners: number;
  isMajor: boolean;
};