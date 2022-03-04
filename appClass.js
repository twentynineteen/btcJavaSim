// hide results
document.getElementById("results").style.display = "none";

class UI {
  // alert
  addResultsToPage(result) {
    const list = document.getElementById("resultsContainer");
    // create Headers
    const headers = document.createElement("tr");
    //Insert headers
    headers.innerHTML = `
    
    <th scope="col" class="px-3">Market</th>
    <th scope="col" class="px-3">Starting Bank</th>
    <th scope="col" class="px-3">Total Bank</th>
    <th scope="col" class="px-3">Odds</th>
    <th scope="col" class="px-3">Stake %</th>
    <th scope="col" class="px-3">Strike Rate</th>
    <th scope="col" class="px-3">Exchange Commission</th>
    <th scope="col" class="px-3">Trades Simulated</th>
    
    `;
    list.appendChild(headers);
    // Create tr
    const row = document.createElement("tr");
    // Insert Columns
    row.innerHTML = `
    <td class="px-3">${result.market}</td>
    <td class="px-3">${result.bank}</td>
    <td class="px-3">${result.totalBank}</td>
    <td class="px-3">${result.odds}</td>
    <td class="px-3">${result.stake}%</td>
    <td class="px-3">${result.strikeRate}%</td>
    <td class="px-3">${result.exchangeCommission}%</td>
    <td class="px-3">${result.simAmount}</td>

    `;
    list.appendChild(row);
  }
  // results window
  showAlert(message, className) {
    //construct elements
    const div = document.createElement("div");
    // add classes
    div.className = `alert ${className} mx-auto mb-3`;
    //add text
    div.appendChild(document.createTextNode(message));

    // get parent container
    const container = document.querySelector(".card");
    const form = document.querySelector("#sim-form");
    // insert alert
    container.insertBefore(div, form);
    // disappear after 3 seconds
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  // delete results
  deleteResult(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  // clear entered fields
  clearFields() {
    document.getElementById("inlineRadioBack").checked = false;
    document.getElementById("inlineRadioLay").checked = false;
    document.getElementById("bank-amount").value = "";
    document.getElementById("odds").value = "";
    document.getElementById("stake-percent").value = "";
    document.getElementById("strike-rate").value = "";
    document.getElementById("commission-amount").value = "";
    document.getElementById("sim-amount").value = "";
  }
}

class Results {
  constructor(
    market,
    bank,
    odds,
    stake,
    strikeRate,
    exchangeCommission,
    simAmount
  ) {
    this.market = market;
    this.bank = bank;

    this.odds = odds;
    this.stake = stake;
    this.strikeRate = strikeRate;
    this.exchangeCommission = exchangeCommission;
    this.simAmount = simAmount;
    this.totalBank = calcSimTotals(
      market,
      simAmount,
      odds,
      strikeRate,
      bank,
      stake,
      exchangeCommission
    ); // this needs to calc totals
  }
}

function calcSimTotals(
  market,
  simAmount,
  odds,
  strikeRate,
  bank,
  stake,
  exchangeCommission
) {
  function isBack() {
    if (market === "Back") {
      losingTradeAmount = lossSumBack(bank, stake);

      winningTradeAmount = winSumBack(bank, stake, odds, exchangeCommission);

      return { losingTradeAmount, winningTradeAmount };
    } else if (market === "Lay") {
      losingTradeAmount = lossSumLay(bank, stake, odds);
      winningTradeAmount = winSumLay(bank, stake, exchangeCommission);
      // console.log("market is lay");
      return { losingTradeAmount, winningTradeAmount };
    } else {
      // console.log("Market is undefined");
      losingTradeAmount = 0;
      winningTradeAmount = 0;

      return { losingTradeAmount, winningTradeAmount };
    }
  }
  let isBackResults = isBack();

  let lostTradeAmount = isBackResults.losingTradeAmount,
    wonTradeAmount = isBackResults.winningTradeAmount;

  winSum = wonTradeAmount;
  console.log(`winSum is ${winSum}`);
  lossSum = lostTradeAmount;
  console.log(`lossSum is ${lossSum}`);

  let failureRate = 100 - strikeRate;

  let green = simAmount * winSum * (strikeRate / 100);
  console.log(`green is ${green}`);
  let red = simAmount * lossSum * (failureRate / 100);
  console.log(`red is ${red}`);

  let bankNum = parseFloat(bank);
  let subTotal = green - red;
  console.log(`subTotal is ${subTotal}`);
  console.log(typeof subTotal);
  console.log(typeof bank);
  console.log(typeof bankNum);
  console.log(`bank is ${bankNum}`);
  let bankTotal = subTotal + bankNum;
  console.log(
    `After ${simAmount} games with an average odds taken amount of ${odds}, your bank will be ${bankTotal}`
  );

  return parseFloat(bankTotal).toFixed(2);
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

// Event listener to simulate results
document.getElementById("simBtn").addEventListener("click", function (e) {
  // show results
  document.getElementById("results").style.display = "block";

  // Instantiate UI
  const ui = new UI();

  const market = getMarket();
  function getMarket() {
    if (document.getElementById("inlineRadioBack").checked) {
      marketVal = "Back";
    } else if (document.getElementById("inlineRadioLay").checked) {
      marketVal = "Lay";
    } else {
      ui.showAlert("Please select whether to back or lay your market", "error");
    }
    return marketVal;
  }

  const bank = document.getElementById("bank-amount").value,
    odds = document.getElementById("odds").value,
    stake = document.getElementById("stake-percent").value,
    strikeRate = document.getElementById("strike-rate").value,
    exchangeCommission = document.getElementById("commission-amount").value,
    simAmount = document.getElementById("sim-amount").value;

  // Instantiate results class
  const result = new Results(
    market,
    bank,
    odds,
    stake,
    strikeRate,
    exchangeCommission,
    simAmount
  );

  // Validate
  if (
    market === "" ||
    bank === "" ||
    odds === "" ||
    stake === "" ||
    strikeRate === "" ||
    exchangeCommission === "" ||
    simAmount === ""
  ) {
    // Alert error
    ui.showAlert("Please fill in all fields", "error");
  } else {
    // Add results to page
    ui.addResultsToPage(result);

    // //test calcsimtotals
    // calcSimtotals(simAmount, odds);

    // Show success
    ui.showAlert("Strategy simulated!", "success");

    //Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

document.getElementById("clrBtn").addEventListener("click", function (e) {
  console.log("clicked");
  if (document.getElementById("resultsContainer")) {
    console.log("true");
    document.getElementById("resultsContainer").innerHTML = "";
    // hide results
    document.getElementById("results").style.display = "none";
  } else {
    console.log("false");
  }

  e.preventDefault();
});
