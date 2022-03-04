// Hide warning div
document.getElementById("warning").style.display = "none";
// Hide results div
// document.getElementById("results").style.display = "none";

let market;
// updateMarket();

// choose market
function updateMarket() {
  if (document.getElementById("inlineRadioBack").checked) {
    market = "Back";
  } else if (document.getElementById("inlineRadioLay").checked) {
    market = "Lay";
  } else {
    market = "undefined!";
  }
  return market;
}

// Simulate results
function simulateResults() {
  updateMarket();
  const simulated = [
    {
      bank: parseInt(document.getElementById("bank-amount").value),
      odds: parseInt(document.getElementById("odds").value),
      stake: parseInt(document.getElementById("stake-percent").value),
      commission: parseInt(document.getElementById("commission-amount").value),
      strategy: market,
      strikeRate: parseInt(document.getElementById("strike-rate").value),
      simAmount: parseInt(document.getElementById("sim-amount").value),
      round: 1,
    },
  ];

  // if all fields correctly filled in...
  if (
    isNaN(simulated[0]["bank"]) ||
    isNaN(simulated[0]["commission"]) ||
    isNaN(simulated[0]["odds"]) ||
    isNaN(simulated[0]["simAmount"]) ||
    isNaN(simulated[0]["stake"]) ||
    isNaN(simulated[0]["strikeRate"]) ||
    isNaN(simulated[0]["bank"]) ||
    simulated[0]["strategy"] === "undefined"
  ) {
    console.log("empty");
    document.getElementById("warning").style.display = "block";
    // Error timeout
    setTimeout(clearWarning, 3000);
  } else {
    // Show results
    document.getElementById("results").style.display = "block"; //TODO only show on valid entry
  }
  return simulated;
}

// ClearWarning
function clearWarning() {
  document.getElementById("warning").remove();
}

// create table div and content
const formEl = document.getElementById("sim-form");
const resultsDivEL = document.querySelector(".resultsTable");
resultsDivEL.className = "table-responsive";
let tHeaderGen = document.createElement("thead");

resultsDivEL.append(tHeaderGen);
let tBodyGen = document.createElement("tbody");
resultsDivEL.append(tBodyGen);

// define global variables
let oddsEl = document.getElementById("odds").value;
let bankTotalEl;
bankEl = document.getElementById("bank-amount").value;
// let simAmountEL = document.getElementById("sim-amount").value;
stakeEl = document.getElementById("stake-percent").value;

let failureRateEL = 100 - document.getElementById("strike-rate").value;
commissionEL = document.getElementById("commission-amount").value;
let strikeRateEL = document.getElementById("strike-rate").value;
// let losingTradeAmount = 0;
// let winningTradeAmount = 0;

// Listen for Simulation button
document.getElementById("sim-form").addEventListener("submit", function (e) {
  // show results
  simulateResults();
  // console.log(market);
  refreshResults();
  calcSimTotals();
  // console.log(simulateResults());
  e.preventDefault();
});

// show table headers
const marketHeaderEl = "Market";
const bankHeaderEl = "Starting Bank";
const totalBankHeaderEl = "Total Bank";
const oddsHeaderEl = "Average Odds";
const stakeHeaderEl = "Stake Percentage";
const strikeRateHeaderEl = "Strike Rate Percentage";
const failureRateHeaderEl = "Failure Rate Percentage";
const commissionHeaderEl = "Commission";
const simAmountHeaderEl = "Sim Amount";
tHeaderGen.innerHTML = `
  <tr>
  <th scope="col" class="px-3">${marketHeaderEl}</th>
  <th scope="col" class="px-3">${bankHeaderEl}</th>
  <th scope="col" class="px-3">${totalBankHeaderEl}</th>
  <th scope="col" class="px-3">${oddsHeaderEl}</th>
  <th scope="col" class="px-3">${stakeHeaderEl}</th>
  <th scope="col" class="px-3">${strikeRateHeaderEl}</th>
  <th scope="col" class="px-3">${failureRateHeaderEl}</th>
  <th scope="col" class="px-3">${commissionHeaderEl}</th>
  <th scope="col" class="px-3">${simAmountHeaderEl}</th>

  </tr>
`;

function refreshResults() {
  // show table body data
  let marketEL = market;

  bankEL = document.getElementById("bank-amount").value;

  // calc sim totals
  bankTotalEl = calcSimTotals(simAmountEL, oddsEl);

  oddsEL = document.getElementById("odds").value;
  stakeEL = document.getElementById("stake-percent").value;
  failureRateEL = 100 - document.getElementById("strike-rate").value;
  commissionEL = document.getElementById("commission-amount").value;
  strikeRateEL = document.getElementById("strike-rate").value;
  var simAmountEL = document.getElementById("sim-amount").value;
  tBodyGen.innerHTML = `
      <tr>
        <td>${marketEL}</td>
        <td>£${bankEL}</td>
        <td>£${bankTotalEl}</td>
        <td>${oddsEL}</td>
        <td>${stakeEL}%</td>
        <td>${strikeRateEL}</td>
        <td>${failureRateEL}</td>
        <td>${commissionEL}%</td>
        <td>${simAmountEL}</td>

      </tr>
      `;
}

function calcSimTotals(simAmount, odds) {
  function isBack() {
    if (market === "Back") {
      losingTradeAmount = lossSumBack(bankEl, stakeEl);
      // losingTradeAmount = 900;
      winningTradeAmount = winSumBack(bankEl, stakeEl, odds, commissionEL);
      // console.log(`winning trade is ${winningTradeAmount}`);
      return { losingTradeAmount, winningTradeAmount };
    } else if (market === "Lay") {
      losingTradeAmount = lossSumLay(bankEl, stakeEl, odds);
      winningTradeAmount = winSumLay(bankEl, stakeEl, commissionEL);
      console.log("market is lay");
      return { losingTradeAmount, winningTradeAmount };
    } else {
      console.log("Market is undefined");
      losingTradeAmount = 0;
      winningTradeAmount = 0;

      return { losingTradeAmount, winningTradeAmount };
    }
  }

  let isBackResults = isBack();
  console.log(`${isBackResults.winningTradeAmount} - is back results`);
  let lostTradeAmount = isBackResults.losingTradeAmount,
    wonTradeAmount = isBackResults.winningTradeAmount;

  // isBack();

  winSum = wonTradeAmount;
  console.log(`winSum is ${winSum}`);
  lossSum = lostTradeAmount;

  let green = simAmount * winSum * (strikeRateEL / 100);
  let red = simAmount * lossSum * (failureRateEL / 100);

  let subTotal = green - red;
  let bankTotal = subTotal + bankEl;
  console.log(
    `After ${simAmount} games with an average odds taken amount of ${odds}, your bank will be ${bankTotal}`
  );

  return bankTotal;
}

function winSumBack(startingBank, stakePercent, odds, commission) {
  let stake = startingBank * (stakePercent / 100);
  let commish = 1 - commission / 100;
  let win_sum = stake * (odds - 1) * commish;
  return win_sum;
}

function winSumLay(startingBank, stakePercent, commission) {
  let stake = startingBank * (stakePercent / 100);
  let commish = 1 - commission / 100;
  win_sum = stake * commish;
  return win_sum;
}

function lossSumBack(startingBank, stakePercent) {
  let stake = startingBank * (stakePercent / 100);
  lossSum = stake;
  return lossSum;
}

function lossSumLay(startingBank, stakePercent, odds) {
  let stake = startingBank * (stakePercent / 100);
  lossSum = stake * (odds - 1);
  return lossSum;
}

// TODO
// enter functions to work out variables
//
// Add entered information to localstorage
// implement graph.js graph underneath sim button
// option to download to csv
// option to simulate again
// option to reset
// option to re-sim with increased bank
// listen for checked radio input

// // update market val

// if (document.querySelector('input[name="inlineRadioOptions"]')) {
//   document
//     .querySelectorAll('input[name="inlineRadioOptions"]')
//     .forEach((elem) => {
//       elem.addEventListener("change", function (event) {
//         var market = event.target.value;
//         var marketEl = event.target.value;
//         refreshResults();
//         console.log(marketEl);
//       });
//     });
// }

// Init results
refreshResults();
