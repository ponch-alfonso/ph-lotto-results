import {firestore} from "firebase-admin";

export type Timestamp = firestore.Timestamp;

export interface LottoResult {
    lottoGame: string;
    combinations: string[];
    drawDate: Timestamp;
    jackpot: number;
    winners: number;
    isMajor: boolean;
}
