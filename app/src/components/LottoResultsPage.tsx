import React, { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@mui/material/CircularProgress';

import { LottoResult } from '../types';
import { LottoCardsList } from './LottoCardsList';
import { getDb } from '../db';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

interface LottoResultsPageProps {
  showAllLottos: boolean // TODO: Firebase DB
}

const WEEK_IN_DAYS = 7;

export const LottoResultsPage: FC<LottoResultsPageProps> = ({ showAllLottos }) => {
  const db = getDb();

  const [fromDate, setFromDate] = React.useState(new Date());
  const [lottoResults, setLottoResults] = React.useState(new Map());
  const [hasMore, setHasMore] = React.useState(true);

  React.useEffect(() => {
    updateLottoResults();
  }, []);

  const filteredLottoResults = filterLottoResults();
  const filteredLottoResultsSize = getResultSize(filteredLottoResults);

  function getLottoResultsByDate(startDate: Date, endDate: Date) {
    console.debug(`Retrieving lotto results from ${startDate} to ${endDate}`);
    const lottosResultCollection = collection(db, "lottoResults");

    const q = query(
      lottosResultCollection,
      where('drawDate', '<', startDate),
      where('drawDate', '>=', endDate),
      orderBy('drawDate', 'desc')
    );

    return getDocs(q);
  };

  async function updateLottoResults() {
    const startDate = new Date(fromDate);
    const endDate = new Date();
    endDate.setDate(startDate.getDate() - WEEK_IN_DAYS);
    setFromDate(endDate);

    let snapShot: any; // todo update any -> firebase query result
    try {
      snapShot = await getLottoResultsByDate(startDate, endDate);
    } catch (e) {
      console.log('Failed to get results');
      console.log(e);
    }

    console.debug(`${snapShot.size} lotto results from ${startDate} to ${endDate}.`);
    if (snapShot.empty) {
      setHasMore(false);
      return
    }

    snapShot.forEach((docRef: any) => {

      let lottoResult = docRef.data();
      lottoResult.drawDate = lottoResult.drawDate.toDate().toJSON();
      lottoResult.objectID = docRef.id;

      if (typeof lottoResults.get(lottoResult.drawDate) === 'undefined') {
        lottoResults.set(lottoResult.drawDate, [lottoResult]);
      } else if (lottoResults.get(lottoResult.drawDate).every(
        (lt: any) => lt.objectID !== lottoResult.objectID)
      ) {
        lottoResults.get(lottoResult.drawDate).push(lottoResult);
      } else {
        /** Do nothing, already exisits */
      }
    });

    setLottoResults(new Map(lottoResults));
  }

  // TODO: Refactor the names/structure of lottoResults
  function filterLottoResults() {
    const filteredLottoResults = new Map(lottoResults);
    filteredLottoResults.forEach((value, key, map) => {
      if (showAllLottos === false) {
        filteredLottoResults.set(
          key,
          value.filter((lottoResult: LottoResult) => lottoResult.isMajor)
        );
      }
    })

    return filteredLottoResults;
  }

  function getResultSize(lottoResults: Map<string, any>) { // deeply nested lottoResults
    let size = 0;
    lottoResults.forEach((value, key, map) => {
      size += value.length;
    })
    return size;
  }

  return (
    <div style={{ width: "fit-content", margin: "auto" }}>
      <InfiniteScroll
        dataLength={filteredLottoResultsSize}
        next={updateLottoResults}
        hasMore={hasMore}
        loader={
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <CircularProgress />
          </div>
        }
        endMessage={
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <h4>End</h4>
          </div>
        }
      >
        {Array.from(filteredLottoResults.keys()).map(drawDate => (
          <LottoCardsList
            key={drawDate}
            date={drawDate}
            lottoResults={filteredLottoResults.get(drawDate)}
          />
        ))}
      </InfiniteScroll>
    </div>
  )
}