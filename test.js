// Hide warning
document.getElementById("warning").style.display = "none";
// Listen for Simulation button
document.getElementById("sim-form").addEventListener("submit", function (e) {
  // Set Strategy based on radio input
  if (document.getElementById("inlineRadioBack").checked) {
    market = "Back";
  } else if (document.getElementById("inlineRadioLay").checked) {
    market = "Lay";
  } else {
    market = "undefined";
  }

  // show results
  simulateResults();

  // show 'loading'?

  e.preventDefault();
});
let simulated = {};
// Simulate results
function simulateResults() {
  console.log("Simulating...");

  // Define variables
  let bank = "",
    // market = "undefined",
    odds = "",
    stake = "",
    commission = "",
    strikeRate = "",
    simAmount = "";

  simulated = [
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

  // simulated variables or functions
  if (typeof simulated === "object") {
    console.log("simulated is an object");
    console.log(Object.keys(simulated));
    console.log(simulated);
  }
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
    console.log(`not empty, success -- sim strategy${simulated["strategy"]}`);
    // document.getElementById("warning").style.display = "none";
    getStaticResults();

    displayResults(
      `Success! Your Bank is ${simulated[0]["bank"]} and your total bank is ${simulated[0]["bank"]}`
    );
  }
}
// TODO
// Display results as table in new results div
// Add entered information to localstorage
// implement graph.js graph underneath sim button
// option to download to csv
// option to simulate again
// option to reset
// option to re-sim with increased bank

// ClearWarning

function clearWarning() {
  document.getElementById("warning").remove();
}

// Display results
function displayResults(msg) {
  // open new div with results
  resultDiv = document.createElement("div");
  // Get elements
  const card = document.querySelector(".card");
  const heading = document.querySelector(".heading");
  resultDiv.className = "mt-3 card card-body";

  // Add text node and append to div
  resultDiv.appendChild(document.createTextNode(msg));

  // insert card above heading
  insertAfter(resultDiv, card);
}

function insertAfter(item, place) {
  place.parentNode.insertBefore(item, place.nextSibling);
}

function getStaticResults() {
  const staticResults = document.querySelector(".resultsTable");
  staticResults.innerHTML += " hi hi hi";
  // staticResults.className = "tbody";
  var myArray = [
    {
      bank: 1000,
      commission: 2,
      odds: 4.7,
      round: 1,
      simAmount: 100,
      stake: 3,
      strategy: "Back",
      strikeRate: 84,
    },
  ];

  let resultTable = document.createElement("table"); // build result table
  resultTable.className = "table table-bordered";

  let resultTableHead = document.createElement("thead"); // create table header group element
  resultTableHead.className = "thead thead-dark";

  let resultTableHeaderRow = document.createElement("tr"); // create the row that holds the headers
  resultTableHeaderRow.className = "row";

  function buildHeaderCol(msg) {
    // BUILD HEADERS FOR TABLE
    let resultTableHeaderCol = document.createElement("th"); // create the row that holds the headers
    resultTableHeaderCol.scope = "col";
    resultTableHeaderCol.className = newArray[num];
    resultTableHeaderCol.innerHTML = msg;
    return resultTableHeaderCol;
  }

  staticResults.append(resultTable); // APPEND TABLE TO STATIC RESULTS
  resultTable.append(resultTableHead); // APPEND CHILDREN
  resultTableHead.append(resultTableHeaderRow);
  newArray = Object.keys(myArray[0]);

  // create a header for each value in myarray
  for (var num = 0; num < newArray.length; num++) {
    let xx = buildHeaderCol(newArray[num]);
    resultTableHeaderRow.append(xx);
    // let desc = newArray[num];
  }
  let resultTableBody = document.createElement("tbody"); // create the body that holds the rows
  resultTableBody.className = "row";
  resultTable.append(resultTableBody);

  const tbodyEl = document.querySelector("tbody");
  const bankEL = document.getElementById("bank-amount").value;
  tbodyEl.innerHTML += `
    <tr>
      <td>${bankEl}</td>
    </tr>
  
  
  `;
}
