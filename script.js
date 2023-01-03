"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// ACCOUNTS
const account1 = {
  owner: "Alena Fleming",
  // Monetary amount of each account movement:
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  // Interest rate. Calculated in percentage (%):
  interestRate: 1.2,
  // Pin number of account:
  pin: 1111,

  // Date and time for each account movement. Calculated later using JavaScript's built-in "Intl.DateTimeFormat" object that enables language-sensitive date and time formatting:
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  // The account currency here will be used by our formatCur function later to format to the correct local currency:
  currency: "EUR",
  // Locale will be used to both format currency and to format the correct date and time in our account:
  locale: "pt-PT",
};

const account2 = {
  owner: "Maisey Charlton",
  // Monetary amount of each account movement:
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  // Interest rate. Calculated in percentage (%):
  interestRate: 1.5,
  // Pin number of account:
  pin: 2222,

  // Date and time for each account movement. Calculated later using JavaScript's built-in "Intl.DateTimeFormat" object that enables language-sensitive date and time formatting:
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2022-02-16T14:43:26.374Z",
    "2022-02-19T18:49:59.371Z",
    "2022-02-22T12:01:20.894Z",
  ],
  // The account currency here will be used by our formatCur function later to format to the correct local currency:
  currency: "USD",
  // Locale will be used to both format currency and to format the correct date and time in our account:
  locale: "en-US",
};

const account3 = {
  owner: "Bradley Smith",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2022-02-16T14:43:26.374Z",
    "2022-02-19T18:49:59.371Z",
    "2022-12-22T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: "Sarah Louise Newton",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2022-11-22T19:09:35.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

// Create "accounts" array containing all our individual accounts:
const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// DOM ELEMENTS
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// FUNCTIONS

// Format account movements' dates using date and locale:
const formatMovementDate = function (date, locale) {
  // Calculate days passed using an input of 2 dates:
  const calcDaysPassed = (date1, date2) =>
    // date1 is the current date, and date2 is the date of each account movement.
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  // Create a new date of this time ("new Date()"), then input it into our daysPassed function along with the date of each account movement ("date"):
  const daysPassed = calcDaysPassed(new Date(), date);

  // With our new daysPassed variable, create custom strings for each condition:
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // Using JS's built-in Intl.DateTimeFormat object, create a date and time that is language-sensitive. "locale" is our locale to use, like en-US, and "date" is our account movement date:
  return new Intl.DateTimeFormat(locale).format(date);
};

// A helper function for language-sensitive number formatting using JS's built-in Intl.NumberFormat object:
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// H\elper function for sorting account movements by date:
const sortMovements = function (movs, dates) {
  const arrCombined = [];
  const sortedMovs = [];
  const sortedDates = [];

  movs.forEach((el, i) => arrCombined.push([movs[i], dates[i]]));
  // Sort movements smallest to largest:
  arrCombined.sort((a, b) => a[0] - b[0]);
  arrCombined.forEach((el) => {
    // After sorting, add each movements to movs and each date to dates:
    sortedMovs.push(el[0]);
    sortedDates.push(el[1]);
  });

  return [sortedMovs, sortedDates];
};

const displayMovements = function (acc, sort = false) {
  // Clear movmenets text and set it to a string:
  containerMovements.innerHTML = "";

  // Sort movements by AMOUNT if sort = true, otherwise leave them as normal, which is sorted by TIME of deposit:
  const [movs, dates] = sort
    ? sortMovements(acc.movements, acc.movementsDates)
    : [acc.movements, acc.movementsDates];

  movs.forEach(function (mov, i) {
    // Add 'deposit' or 'withdrawal' to each movement:
    const type = mov > 0 ? "deposit" : "withdrawal";

    // Get each date from account data, then format it for locale:
    const date = new Date(acc.movementsDates[i]);

    // Display date for each account movement:
    const displayDate = formatMovementDate(new Date(dates[i]), acc.locale);

    // Just like for the date, format each currency for locale:
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    // Create HTML markup using template literals of our data:
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>

        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    // Insert our newly created HTML into the DOM:
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Create function to display balance. Using Array.prototype.reduce, get each previous element and add it to the current element:
const calcDisplayBalance = function (acc) {
  // Set acc.balance to the total account balance:
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // Display balance, using our function formatCur to have the currency and locale appropriate for the user:
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// Display account details: incoming money, outgoing money, and interest earned. All in the appropraite currency:
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    // Get only positive account movements using Array.filter:
    .filter((mov) => mov > 0)
    // Use Array.reduce to add all the movements we have filtered, thus getting the total incomes (positive values) from the account:
    .reduce((cumulative, nextMov) => cumulative + nextMov, 0);
  // Display total incomes, formatted for locale and currency:
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    // Get only negative account movements using Array.filter:
    .filter((mov) => mov < 0)
    // Like with incomes, use Array.reduce to add all the movements we have filtered, thus getting the total expenses (negative values) from the account:
    .reduce((cumulative, nextMov) => cumulative + nextMov, 0);
  // Display total expenses, formatted for locale and currency (Math.abs gets the absolute value of our negative number, thus making it positive):
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    // Get only positive account movements using Array.filter:
    .filter((mov) => mov > 0)
    // Use Array.map to make a new array. Then, for each item (called deposit) in that array, return the interest rate of that item using the below calculation:
    .map((deposit) => (deposit * acc.interestRate) / 100)
    // Interest is only given if the movement is big enough. In our case, if the interest for that movement is less than 1%, it does not get added to the account:
    .filter((int) => int >= 1)
    // Add all elements, thus getting total interest:
    .reduce((acc, int) => acc + int, 0);
  // Display total interest earned, formatted for locale and currency:
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  // For each account, take the first letter of the user's first, last, and middle name (if provided) to create their username login:
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
// Run createUsernames function for "accounts":
createUsernames(accounts);

// Create function that contains all our display functions:
const updateUI = function (acc) {
  // Display movements:
  displayMovements(acc);

  // Display balance:
  calcDisplayBalance(acc);

  // Display summary:
  calcDisplaySummary(acc);
};

// Create function for logging the user out:
const startLogoutTimer = function () {
  // Set timer to 2-minute timeout:
  let time = 120;

  // Create a function, "tick", that counts down each second and displays that to the DOM:
  const tick = function () {
    // From our time variable, get the minute and second before the login times out. Pad the numbers with 0 to make it look normal:
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // Print the current minute and second to the UI:
    labelTimer.textContent = `${min}:${sec}`;

    // When time is 0 seconds, stop timer and log user out:
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    // Each time our function, "tick", is called, reduce time by 1:
    time--;
  };

  // Call countdown timer at initial login:
  tick();
  // Call countdown timer every second (every 1000 milliseconds):
  const timer = setInterval(tick, 1000);
  return timer;
};

/////////////////////////////////////////////////
// Event handlers

// Create global variables we'll need later:
let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting:
  e.preventDefault();

  // From the "inputLoginUsername" DOM element we grabbed earlier, find the account that matches what the user typed in:
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // Use short circuiting to check if account exists (?). If so, see if the account's pin value (as a string) matches the user's input:
  if (currentAccount?.pin === +inputLoginPin.value) {
    // If pin is valid, display UI and message. We get the user's first name by splitting the first value of the account owner property:
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    // Reveal account:
    containerApp.style.opacity = 100;

    // Create current date and time. The default "new Date" is right now:
    const now = new Date();
    // Create options for time format. By default, the time is displayed like "May 15, 2045":
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long", // Can set 'numeric', 'long', or '2-digit'
      year: "numeric",
      // weekday: 'long', // Can set 'numeric', 'long', 'short', or 'narrow'
    };

    // Inside the account screen, post the current time and date, formatted for locale:
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields:
    inputLoginUsername.value = inputLoginPin.value = "";
    // Use HTMLElement.blur() to remove keyboard focus from the current element (in this case, the login fields):
    inputLoginPin.blur();

    // If a logout timer exists, clear it:
    if (timer) clearInterval(timer);

    // Set a new logout timer:
    timer = startLogoutTimer();

    // Update UI with the account we have logged in with:
    updateUI(currentAccount);
  }
});

// Transfer money button
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  // Get transfer value as a string:
  const amount = +inputTransferAmount.value;
  // Find transfer receiver account. "inputTransferTo" is the DOM element we grabbed earlier that's holding the text we type into "transfer to":
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  // After finding the account, clear input fields. On the user side, this appears as the text clearing after they finish their transfer:
  inputTransferAmount.value = inputTransferTo.value = "";

  // If transfer amount is > 0, the receiver account exists, the current account has enough money, and receiver account username does NOT match current username, then the conditional "if" block runs:
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Add negative move to current account:
    currentAccount.movements.push(-amount);
    // Add sent amount to receiver account:
    receiverAcc.movements.push(amount);

    // Add a new date, the date of this transfer, to both the sender and receiver accounts. "toISOString" returns the time in a standardized 24-27 character long format:
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update the UI:
    updateUI(currentAccount);

    // Reset timer:
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

// Request loan button
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  // Math.floor() returns the largest integer less than or equal to the given number. For example, if input is 5.95, return is 5:
  const amount = Math.floor(inputLoanAmount.value);

  // If loan is > 0, and account has a deposit at least 10% of the requested loan amount, then continue:
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add loan amount to current account:
      currentAccount.movements.push(amount);

      // Add loan date:
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI with the new loan:
      updateUI(currentAccount);

      // Reset timer:
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }
  // Clear loan text field:
  inputLoanAmount.value = "";
});

// Close account button
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  // If the account and pin entered match up with the logged-in account, then run block. inputClosePin.value is turned into a string with "+":
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // Use findIndex to return the first element in our "accounts" array that satisfies the condition. In this case, the first account that matches acc.username:
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Delete account from "accounts" array:
    accounts.splice(index, 1);

    // Hide UI:
    containerApp.style.opacity = 0;
  }

  // Clear text fields:
  inputCloseUsername.value = inputClosePin.value = "";
});

// Initial state for the "sorted" variable
let sorted = false;

// Sort button
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  // Display current account movements opposite of "sorted", which is "true". In our displayMovements, this means sort my AMOUNT:
  displayMovements(currentAccount, !sorted);
  // Set "sorted" to true/false, depending on what "!sorted" is. This changes from true-false each time the button is clicked:
  sorted = !sorted;
});
