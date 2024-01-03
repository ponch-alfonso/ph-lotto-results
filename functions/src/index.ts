import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {getLottoResults} from "./PCSOScraper";

const FB_COLLECTION_NAME = "lottoResults";

admin.initializeApp();

const db = admin.firestore();

// http://127.0.0.1:5001/daily-pcso/asia-northeast1/getResults
exports.testPushYesterdaysResults = functions
    .region("asia-northeast1")
    .https.onRequest(async (req, res) => {
      try {
        await pushYesterdaysResults();
      } catch (e) {
        res.status(500).send(e);
        return;
      }
      res.status(200).send("OK");
    });

// http://127.0.0.1:5001/daily-pcso/asia-northeast1/testPushYesterdaysResults-0
exports.pushYesterdaysResults = functions
    .region("asia-northeast1")
    .pubsub.schedule("15 9 * * *")
    .onRun(async () => {
      await pushYesterdaysResults();
      return null;
    });

/**
 * Retrieves lotto results for yesterday and adds them to the database.
 *
 * @return {Promise<void>} A promise that resolves when the lotto results have
 * been added to the database.
 */
async function pushYesterdaysResults(): Promise<void> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 2);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);
  endDate.setHours(23, 59, 59, 999);

  functions.logger.info(`Getting dates from: ${startDate} to ${endDate}`);

  const lottoResults = await getLottoResults();

  functions.logger.debug(`Got ${lottoResults.length} lotto results`);

  const batch = db.batch();

  lottoResults.forEach((lottoResult) => {
    const docId = generateDocId(lottoResult.drawDate.toDate(), lottoResult.lottoGame);
    const docRef = db.collection(FB_COLLECTION_NAME).doc(docId);
    batch.set(docRef, lottoResult);
  });

  await batch.commit();
}

/**
 * Generates a document ID for a lotto game draw on a given date.
 *
 * @param {Date} drawDate The date of the lotto game draw.
 * @param {string} lottoGame The name of the lotto game.
 * @return {string} A document ID in the format `YYYY-MM-DD: LOTTO_GAME`.
 */
function generateDocId(drawDate: Date, lottoGame: string): string {
  const drawDateString = drawDate.toLocaleDateString("ja-JP");
  return `${drawDateString}: ${lottoGame}`.replace(/\//g, "-");
}
