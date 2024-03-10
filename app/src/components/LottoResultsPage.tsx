import React, { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  LottoResultsFilterState,
  LottoResult,
  LottoResultsFilter,
} from "../utils/types";
import { getFirestoreInstance } from "../utils/firebase-helper";
import {
  Timestamp,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { LottoCard } from "./LottoCard/LottoCard";

import { Box } from "@mui/material";
import { LottoGame } from "../utils/constants";

interface LottoResultsPageProps {
  filterState: LottoResultsFilterState;
}

const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_LOTTO_RESULTS_COUNT = 3;

export const LottoResultsPage: FC<LottoResultsPageProps> = ({
  filterState,
}) => {
  const initialLottoResults = getInitialLotteryResults();
  const [startDate, setStartDate] = React.useState(new Date());
  const [hasMore, setHasMore] = React.useState(true);
  const [lottoResults, setLottoResults] =
    React.useState<LottoResult[]>(initialLottoResults);
  const [hasInitialLottoResults, setHasInitialLottoResults] =
    React.useState(true);
  const [filteredLottoResults, setFilteredLottoResults] = React.useState<
    LottoResult[]
  >([]);
  const [filteredLottoResultsCount, setFilteredLottoResultsCount] =
    React.useState<number>(0);

  React.useEffect(() => {
    getLottoResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setFilteredLottoResults(
      getFilteredLottoResults(filterState.filter, lottoResults)
    );
    setFilteredLottoResultsCount(filteredLottoResults.length);

    console.debug(
      `Filtered lotto results: ${filteredLottoResultsCount} / ${lottoResults.length}`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState.filter, lottoResults]);

  async function getLottoResults() {
    const from = new Date(startDate.getTime() - WEEK_IN_MILLISECONDS);
    const to = startDate;
    setStartDate(from);

    console.log(`Getting lotto results from ${from} to ${to}`);
    const unfilteredLottoResults = await fetchLottoResults(from, to);

    if (unfilteredLottoResults.length === 0) {
      setHasMore(false);
      return;
    }

    let mergedLottoResults: LottoResult[] = [];
    if (hasInitialLottoResults) {
      mergedLottoResults = mergeWithInitialLottoResults(
        initialLottoResults,
        unfilteredLottoResults
      );
      setHasInitialLottoResults(false);
    } else {
      mergedLottoResults = lottoResults.concat(unfilteredLottoResults);
    }

    setLottoResults(mergedLottoResults);
  }

  // TODO: Move this to a separate component: feed
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "fit-content" },
        maxWidth: { xs: "100%", sm: "80%" },
        margin: "auto",
        marginTop: "10px",
      }}
    >
      <InfiniteScroll
        dataLength={filteredLottoResultsCount}
        next={getLottoResults}
        hasMore={hasMore}
        // TODO: Remove loader
        loader={[...Array(DEFAULT_LOTTO_RESULTS_COUNT)].map((_, i) => (
          <LottoCard key={i} isFirst={i == 0} />
        ))}
        endMessage={
          // TODO: Add image when end of list is reached
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <h4>End</h4>
          </div>
        }
      >
        {
          // TODO: Add logic to insert adds here
          Array.from(filteredLottoResults).map((lottoResult, index) => (
            <LottoCard
              key={lottoResult.objectID}
              isFirst={index === 0}
              lottoResult={lottoResult}
            />
          ))
        }
      </InfiniteScroll>
    </Box>
  );
};

/**
 * Filters the lottery results based on the filter.
 *
 * @param {LottoResultsFilter} filter The filter to apply to the lottery results.
 * @param {LottoResult[]} lottoResults The lottery results to filter.
 * @return {LottoResult[]} The filtered lottery results.
 */
function getFilteredLottoResults(
  filter: LottoResultsFilter,
  lottoResults: LottoResult[]
): LottoResult[] {
  const filteredLottoResults = lottoResults.filter(
    (lottoResult: LottoResult) => {
      if (
        (filter.ultra === true && lottoResult.lottoGame === LottoGame.ULTRA) ||
        (filter.mega === true && lottoResult.lottoGame === LottoGame.MEGA) ||
        (filter.super === true && lottoResult.lottoGame === LottoGame.SUPER) ||
        (filter.lotto === true && lottoResult.lottoGame === LottoGame.LOTTO) ||
        (filter.grand === true && lottoResult.lottoGame === LottoGame.GRAND) ||
        (filter.lotto6D === true &&
          lottoResult.lottoGame === LottoGame.LOTTO_6D) ||
        (filter.lotto4D === true &&
          lottoResult.lottoGame === LottoGame.LOTTO_4D) ||
        (filter.swertres3D === true &&
          (lottoResult.lottoGame === LottoGame.SWERTRES_3D_2PM ||
            lottoResult.lottoGame === LottoGame.SWERTRES_3D_5PM ||
            lottoResult.lottoGame === LottoGame.SWERTRES_3D_9PM)) ||
        (filter.swertres2D === true &&
          (lottoResult.lottoGame === LottoGame.SWERTRES_2D_2PM ||
            lottoResult.lottoGame === LottoGame.SWERTRES_2D_5PM ||
            lottoResult.lottoGame === LottoGame.SWERTRES_2D_9PM))
      ) {
        return true;
      }

      return false;
    }
  );

  return filteredLottoResults;
}

/**
 * Fetches the lottery results from the Firestore database.
 * The lottery results are fetched from the Firestore database based on the
 * start and end date.
 *
 * @param {Date} startDate The start date of the lottery results to fetch.
 * @param {Date} endDate The end date of the lottery results to fetch.
 * @return {Promise<LottoResult[]>} The lottery results fetched from the Firestore database.
 */
async function fetchLottoResults(
  startDate: Date,
  endDate: Date
): Promise<LottoResult[]> {
  const firestore = getFirestoreInstance();
  const lottosResultCollection = collection(firestore, "lottoResults");

  const q = query(
    lottosResultCollection,
    where("drawDate", ">", startDate),
    where("drawDate", "<=", endDate),
    orderBy("drawDate", "desc")
  );

  const snapShot = await getDocs(q);
  const lottoResults = snapShot.docs.map((docRef: any) => ({
    ...docRef.data(),
    objectID: docRef.id,
  }));

  console.debug(
    `${snapShot.size} lotto results from ${startDate} to ${endDate}.`
  );

  return lottoResults;
}

/**
 * Merges the initial lottery results with the new lottery results.
 * This is to ensure that the initial lottery results are replaced when the new
 * lottery results are fetched.
 *
 * Do this only once, when the initial lottery results are generated locally.
 *
 * @param {LottoResult[]} initialLottoResults The initial, locally generated lottery results.
 * @param {LottoResult[]} newLottoResults The new lottery results.
 * @return {LottoResult[]} The merged lottery results.
 */
function mergeWithInitialLottoResults(
  initialLottoResults: LottoResult[],
  newLottoResults: LottoResult[]
): LottoResult[] {
  const uniqueLottoResults = initialLottoResults
    .concat(newLottoResults)
    .reduce((acc: LottoResult[], lottoResult: LottoResult) => {
      const index = acc.findIndex(
        (accLottoResult: LottoResult) =>
          accLottoResult.objectID === lottoResult.objectID
      );
      if (index !== -1) {
        acc[index] = lottoResult;
      } else {
        acc.push(lottoResult);
      }
      return acc;
    }, []);

  return uniqueLottoResults;
}

/**
 * Returns the initial lottery results for the past 7 days.
 *
 * @return {LottoResult[]} The initial lottery results for the past 7 days.
 */
function getInitialLotteryResults(): LottoResult[] {
  const dayCount = 7;
  const today = new Date();

  const initialLotteryResults = Array.from({ length: dayCount }, (_, i) => {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    return getInitialLotteryResultsForTheDay(date);
  }).flat();

  return initialLotteryResults;
}

/**
 * Returns the initial lottery results for the day.
 *
 * @param {Date} date date of the day.
 *
 * @return {LottoResult[]} The initial lottery results for the day.
 */
function getInitialLotteryResultsForTheDay(date: Date): LottoResult[] {
  const lottosForTheDay = getScheduleLottosForTheDay(date.getDay());
  const numberOfBallsMap = {
    [LottoGame.ULTRA]: 6,
    [LottoGame.SUPER]: 6,
    [LottoGame.GRAND]: 6,
    [LottoGame.MEGA]: 6,
    [LottoGame.LOTTO]: 6,
    [LottoGame.LOTTO_6D]: 6,
    [LottoGame.LOTTO_4D]: 4,
    [LottoGame.SWERTRES_3D_2PM]: 3,
    [LottoGame.SWERTRES_3D_5PM]: 3,
    [LottoGame.SWERTRES_3D_9PM]: 3,
    [LottoGame.SWERTRES_2D_2PM]: 2,
    [LottoGame.SWERTRES_2D_5PM]: 2,
    [LottoGame.SWERTRES_2D_9PM]: 2,
  };

  const initialLotteryResults = lottosForTheDay.map((lottoGame: LottoGame) => {
    const objectID = generateDocId(date, lottoGame);
    const combinations = Array.from(
      { length: numberOfBallsMap[lottoGame] },
      () => undefined
    );
    const drawDate = Timestamp.fromDate(date);
    const jackpot = undefined;
    const winners = undefined;

    return {
      objectID,
      lottoGame,
      combinations,
      drawDate,
      jackpot,
      winners,
    };
  });

  return initialLotteryResults;
}

/**
 * Returns the lotto games scheduled for the day. Schedule of the lotto is:
 *   - SUNDAY: Ultra Lotto 6/58, Super Lotto 6/49
 *   - MONDAY: Grand Lotto 6/55, Mega Lotto 6/45, 4D Lotto
 *   - TUESDAY: Ultra Lotto 6/58, Super Lotto 6/49, Lotto 6/42, 6D Lotto
 *   - WEDNESDAY: Grand Lotto 6/55, Mega Lotto 6/45, 4D Lotto
 *   - THURSDAY: Super Lotto 6/49, Lotto 6/42, 6D Lotto
 *   - FRIDAY: Ultra Lotto 6/58, Mega Lotto 6/45, 4D Lotto
 *   - SATURDAY: Grand Lotto 6/55, Lotto 6/42, 6D Lotto
 *   - EVERYDAY: 3D Lotto 2PM, 3D Lotto 5PM, 3D Lotto 9PM, 2D Lotto 2PM, 2D Lotto 5PM, 2D Lotto 9PM
 *
 * @param {number} day The day of the week. Where 0 is Sunday, 1 is Monday, and so on.
 *
 * @return {LottoGame[]} The lotto games scheduled for the day.
 */
function getScheduleLottosForTheDay(day: number): LottoGame[] {
  const lottoScheduleMap = {
    0: [LottoGame.ULTRA, LottoGame.SUPER],
    1: [LottoGame.GRAND, LottoGame.MEGA, LottoGame.LOTTO_4D],
    2: [LottoGame.ULTRA, LottoGame.SUPER, LottoGame.LOTTO, LottoGame.LOTTO_6D],
    3: [LottoGame.GRAND, LottoGame.MEGA, LottoGame.LOTTO_4D],
    4: [LottoGame.SUPER, LottoGame.LOTTO, LottoGame.LOTTO_6D],
    5: [LottoGame.ULTRA, LottoGame.MEGA, LottoGame.LOTTO_4D],
    6: [LottoGame.GRAND, LottoGame.LOTTO, LottoGame.LOTTO_6D],
  };

  let lottosForTheDay: LottoGame[] =
    lottoScheduleMap[day as keyof typeof lottoScheduleMap];

  lottosForTheDay = lottosForTheDay.concat([
    LottoGame.SWERTRES_3D_2PM,
    LottoGame.SWERTRES_3D_5PM,
    LottoGame.SWERTRES_3D_9PM,
    LottoGame.SWERTRES_2D_2PM,
    LottoGame.SWERTRES_2D_5PM,
    LottoGame.SWERTRES_2D_9PM,
  ]);

  return lottosForTheDay;
}

/**
 * Generates a document ID for a lotto game draw on a given date.
 * Copy-pasted from functions/src/index.ts
 *
 * @param {Date} drawDate The date of the lotto game draw.
 * @param {string} lottoGame The name of the lotto game.
 * @return {string} A document ID in the format `YYYY-MM-DD: LOTTO_GAME`.
 */
function generateDocId(drawDate: Date, lottoGame: string): string {
  const drawDateString = drawDate.toLocaleDateString("ja-JP");
  return `${drawDateString}: ${lottoGame}`.replace(/\//g, "-");
}
