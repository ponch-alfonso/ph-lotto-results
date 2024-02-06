import React, { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";

import {
  LottoResultsFilterState,
  LottoResult,
  LottoResultsFilter,
} from "../utils/types";
import { getDb } from "../utils/db-helper";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

import { LottoCard } from "./LottoCard/LottoCard";

import { Box } from "@mui/material";
import { LottoGame } from "../utils/constants";

interface LottoResultsPageProps {
  filterState: LottoResultsFilterState;
}

const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

export const LottoResultsPage: FC<LottoResultsPageProps> = ({
  filterState,
}) => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [hasMore, setHasMore] = React.useState(true);
  const [lottoResults, setLottoResults] = React.useState<LottoResult[]>([]);
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

    setLottoResults(lottoResults.concat(unfilteredLottoResults));
  }

  // TODO: Move this to a separate component: feed
  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "80%" },
        maxWidth: { xs: "100%", sm: "80%" },
        margin: "auto",
      }}
    >
      <InfiniteScroll
        dataLength={filteredLottoResultsCount}
        next={getLottoResults}
        hasMore={hasMore}
        loader={
          // TODO: Change to skeleton (?)
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <CircularProgress />
          </div>
        }
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

async function fetchLottoResults(
  startDate: Date,
  endDate: Date
): Promise<LottoResult[]> {
  const db = getDb();
  const lottosResultCollection = collection(db, "lottoResults");

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
