import axios from "axios";
import {LottoResult} from "./types";
import {MAJOR_LOTTOS, PCSO_URL, PCSO_RESULT_TABLE_SELECTOR} from "./constants";
import {JSDOM} from "jsdom";
import * as admin from "firebase-admin";

export interface RawLottoResult {
  lottoGame: string;
  combinations: string;
  drawDate: string;
  jackpot: string;
  winners: string;
}

/**
 * Gets the lotto results for a given date range.
 *
 * @param {Date} startDate The start date of the date range.
 * @param {Date} endDate The end date of the date range.
 * @return {Promise<LottoResult[]>} A promise that resolves to an array of LottoResult objects.
 */
export async function getLottoResults(startDate?: Date, endDate?: Date): Promise<LottoResult[]> {
  const pcsoHtml = await getPCSOSearchPage();
  const dom = new JSDOM(pcsoHtml);

  return parseDOM(dom, startDate, endDate);
}

/**
 * Gets the PCSO search page.
 *
 * @return {Promise<string>} A promise that resolves to the PCSO search page HTML.
 */
async function getPCSOSearchPage(): Promise<string> {
  const response = await axios.get(PCSO_URL);
  return response.data;
}

/**
 * Parses the PCSO search result page DOM and return lotto results that
 * are within the start date and end date.
 *
 * @param {JSDOM} dom The DOM to be parsed.
 * @param {Date} startDate The start date of the date range.
 * @param {Date} endDate  The end date of the date range.
 * @return {LottoResult[]} Array of LottoResult objects.
 */
function parseDOM(dom: JSDOM, startDate?: Date, endDate?: Date): Array<LottoResult> {
  const lottoResults = [];
  const lottoResultTable = dom.window.document.querySelector(PCSO_RESULT_TABLE_SELECTOR);

  if (lottoResultTable === null) {
    throw new Error(
        `Failed to find lotto table using: ${PCSO_RESULT_TABLE_SELECTOR}`
    );
  }

  const tableRows = lottoResultTable.getElementsByTagName("tr");

  for (const row of tableRows) {
    const cells = row.getElementsByTagName("td");
    if (cells.length === 0) {
      continue;
    }

    const rawLottoResult = parseTableRows(cells);
    const lottoDate = new Date(rawLottoResult.drawDate);
    if ((startDate && lottoDate < startDate) || (endDate && lottoDate >= endDate)) {
      continue;
    }

    const lottoResult = createLottoResultObj(rawLottoResult);
    lottoResults.push(lottoResult);
  }

  return lottoResults;
}

/**
 * Parsers the lotto results from the HTML cell table elements.
 *
 * @param {HTMLCollectionOf<HTMLTableCellElement>} cells The HTML cell table elements.
 * @return {RawLottoResult} Raw text values of the lotto results.
 */
function parseTableRows(cells: HTMLCollectionOf<HTMLTableCellElement>): RawLottoResult {
  const lottoGame = cells[0].textContent;
  const combinations = cells[1].textContent;
  const drawDate = cells[2].textContent;
  const jackpot = cells[3].textContent;
  const winners = cells[4].textContent;

  if (lottoGame == null) {
    throw new Error("Failed to get lottoGame");
  }
  if (combinations == null) {
    throw new Error("Failed to get combinations");
  }
  if (drawDate == null) {
    throw new Error("Failed to get lottoGame");
  }
  if (jackpot == null) {
    throw new Error("Failed to get jackpot");
  }
  if (winners == null) {
    throw new Error("Failed to get winners");
  }

  return {lottoGame, combinations, drawDate, jackpot, winners};
}

/**
 * Creates LottoResult object from RawLottoResult.
 *
 * @param {RawLottoResult} rawLottoResult The parsed text of the lotto results.
 * @return {LottoResult} The data container object for the lotto results.
 */
function createLottoResultObj(rawLottoResult: RawLottoResult): LottoResult {
  const {lottoGame, combinations, drawDate, jackpot, winners} = rawLottoResult;
  const isMajor = lottoGame ? MAJOR_LOTTOS.includes(lottoGame) : false;

  const lottoResult: LottoResult = {
    drawDate: admin.firestore.Timestamp.fromDate(new Date(drawDate)),
    lottoGame: lottoGame,
    // Todo: convert this to an array of ints
    combinations: combinations.trim().split("-"),
    winners: parseInt(winners),
    jackpot: parseFloat(jackpot.replace(/,/g, "")),
    isMajor: isMajor,
  };

  return lottoResult;
}


