const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const amountInput =
  document.querySelector("#from + p + input") ||
  document.querySelectorAll("input")[0];
const resultInput =
  document.querySelector("#to + p + input") ||
  document.querySelectorAll("input")[1];
const dateInput = document.querySelector('input[type="date"]');

async function convertCurrency() {
  const from = fromSelect.value;
  const to = toSelect.value;
  const amount = parseFloat(amountInput.value);

  // 1. Fixed: This check must be inside the function
  if (isNaN(amount) || amount <= 0) {
    resultInput.value = "";
    return;
  }

  const date = dateInput.value || "latest";

  const apiKey = "a56866d363ac6f4e9b1f36269a47a361";

  try {
    const url =
      date === "latest"
        ? `https://api.exchangerate.host/convert?access_key=${apiKey}&from=${from}&to=${to}&amount=${amount}`
        : `https://api.exchangerate.host/${date}?access_key=${apiKey}&base=${from}&symbols=${to}`;

    const res = await fetch(url);
    const data = await res.json();

    let converted;
    if (date === "latest") {
      converted = data.result;
    } else {
      // 2. Fixed: Use 'amount' variable and assign the result to 'converted'
      const rate = data.rates[to];
      converted = amount * rate;
    }

    // 3. Fixed: Ensure converted is a number before calling toFixed
    resultInput.value = converted ? converted.toFixed(4) : "N/A";
  } catch (err) {
    console.error("Fetch Error:", err);
    resultInput.value = "ERROR";
  }
}

// Event Listeners
amountInput.addEventListener("input", convertCurrency);
fromSelect.addEventListener("change", convertCurrency);
toSelect.addEventListener("change", convertCurrency);
dateInput.addEventListener("change", convertCurrency);
