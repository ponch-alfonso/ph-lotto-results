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

export interface LottoResultsFilter {
  ultra : boolean,
  mega : boolean,
  super : boolean,
  lotto : boolean,
  grand : boolean,
  lotto6D : boolean,
  lotto4D : boolean,
  swertres3D : boolean,
  swertres2D : boolean,
  /** 
   * TODO: Other searchs:
   * 1. string search
   * 2. todays results
   * 3. per lotto results
   */
}

export interface LottoResultsFilterState {
  filter: LottoResultsFilter;
  setFilter: (filter: LottoResultsFilter) => void;
}
