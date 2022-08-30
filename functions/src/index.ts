import axios from 'axios';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { JSDOM } from 'jsdom';
import { firestore } from 'firebase-admin';

const PCSO_URL = "https://www.pcso.gov.ph/SearchLottoResult.aspx"
const LOTTO_RESULT_TABLE_SELECTOR = ".search-lotto-result-table";

admin.initializeApp();

const db = admin.firestore();
const majorLottos = [
    'Ultra Lotto 6/58',
    'Megalotto 6/45',
    'Superlotto 6/49',
    'Lotto 6/42',
    'Grand Lotto 6/55',
]

interface LottoResult {
    lottoGame: string;
    combinations: string[];
    drawDate: firestore.Timestamp;
    jackpot: number;
    winners: number;
    isMajor: boolean;
};

// Used for testing
exports.getResults = functions.https.onRequest((req, res) => {
    pushYesterdaysResults();
    res.status(200).send('Woohoo');
});

exports.pushYesterdaysResults = functions.pubsub.schedule('15 9 * * *').onRun(context => {
    pushYesterdaysResults();
    return null;
})

const pushYesterdaysResults = async () => {
    const response = await axios.get(PCSO_URL);
    await pushResults(response.data)
}

const pushResults = async (html: any) => {
    const dom = new JSDOM(html);
    const lottoResultTable = dom.window.document
        .querySelector(LOTTO_RESULT_TABLE_SELECTOR)

    if (lottoResultTable === null) {
        throw new Error(
            `Failed to find lotto table using: ${LOTTO_RESULT_TABLE_SELECTOR}`
        );
    }

    const tableRows = lottoResultTable.getElementsByTagName("tr")
    const batch = db.batch();

    const dateYesterday = new Date();
    dateYesterday.setDate(dateYesterday.getDate() - 1);

    for (let row of tableRows) {
        const cells = row.getElementsByTagName("td");

        const lottoResult = getLottoResults(cells, dateYesterday);

        if (lottoResult == null) {
            continue;
        }

        const docId = generateDocId(dateYesterday, lottoResult.lottoGame);
        const docRef = db.collection('lottoResults').doc(docId);
        batch.set(docRef, lottoResult);

        functions.logger.info(`Added ${docRef.id}: ${lottoResult.lottoGame}`);
    };

    await batch.commit();

    function getLottoResults(cells: HTMLCollectionOf<HTMLTableCellElement>, targetDate: Date): LottoResult | null {
        targetDate.setDate(targetDate.getDate() - 1);
        const targetDateString = targetDate.toLocaleDateString("en-US");

        functions.logger.info("Processing results for: " + targetDateString);

        if (cells.length === 0) {
            return null;
        }

        const lottoGame = cells[0].textContent;
        const combinations = cells[1].textContent;
        const drawDate = cells[2].textContent;
        const jackpot = cells[3].textContent;
        const winners = cells[4].textContent;

        // disable for testing
        // if (targetDateString !== drawDate) {
        // functions.logger.info(
        //     `Skipping results for: ${targetDateString}. Not the target date.`
        // );
        //     return null;
        // }

        if (lottoGame == null) {
            throw new Error(`Failed to get lottoGame`);
        }
        if (combinations == null) {
            throw new Error(`Failed to get combinations`);
        }
        if (drawDate == null) {
            throw new Error(`Failed to get lottoGame`);
        }
        if (jackpot == null) {
            throw new Error(`Failed to get jackpot`);
        }
        if (winners == null) {
            throw new Error(`Failed to get winners`);
        }

        const isMajor = lottoGame ? majorLottos.includes(lottoGame) : false;

        const lottoResult: LottoResult = {
            drawDate: admin.firestore.Timestamp.fromDate(new Date(drawDate)),
            lottoGame: lottoGame,
            // Todo: convert this to an array of ints
            combinations: combinations.trim().split('-'),
            winners: parseInt(winners),
            jackpot: parseFloat(jackpot.replace(/,/g, '')),
            isMajor: isMajor
        };

        return lottoResult;
    }

    function generateDocId(drawDate: Date, lottoGame: string): string {
        const drawDateString = drawDate.toLocaleDateString("ja-JP");
        return `${drawDateString}: ${lottoGame}`.replace(/\//g, '-');
    }
}

// module.exports = { pushResults };
