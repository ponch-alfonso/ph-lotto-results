import {getLottoResults} from "./../src/PCSOScraper";

/**
 * The main function for the Node.js script.
 *
 * @return {Promise<void>} A promise that resolves to `void` when the script is finished executing.
 */
async function main(): Promise<void> {
  const dateYesterday = new Date();
  dateYesterday.setDate(dateYesterday.getDate() - 14); // TODO:change to 1

  const results = getLottoResults();
  console.log(results);
}

main();
