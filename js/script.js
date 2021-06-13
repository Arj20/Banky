"use strict";

// BANKY APP

// Data
const account1 = {
  owner: "Arihant Jain",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2021-06-08T23:36:17.929Z",
    "2021-06-10T10:51:36.790Z",
  ],
  currency: "INR",
  locale: "en-US",
  // de-DE
  pin: 1111,
};

const account2 = {
  owner: "Julia Roberts",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2021-06-08T23:36:17.929Z",
    "2021-06-10T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
  pin: 2222,
};

const account3 = {
  owner: "Christopher Ronaldo",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2021-06-08T23:36:17.929Z",
    "2021-06-10T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
  pin: 3333,
};

const account4 = {
  owner: "Will Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2021-06-08T23:36:17.929Z",
    "2021-06-10T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US",
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////

const label_welcome = document.querySelector("#welcome");
const label_balance = document.querySelector("#balance__value");
const label_income = document.querySelector(".summary__value--in");
const label_outcome = document.querySelector(".summary__value--out");
const label_interest = document.querySelector(".summary__value--interest");
const label_login_date = document.querySelector("#date");
const label__console = document.querySelector(".console__label");
const login_form = document.querySelector(".credentials");
const transfer_form = document.querySelector(".transfer__form");
const closeaccount__form = document.querySelector(".closeaccount__form");
const loan_form = document.querySelector(".request-loan");
const labelTimer = document.querySelector(".time");

const loan_input_amount = document.querySelector(".loan_input");
const form_input_user = document.querySelector("#user");
const form_input_password = document.querySelector("#password");
const close_input_user = document.querySelector(".user_value");
const close_input_pin = document.querySelector(".user_pin");
const close_account_button = document.querySelector(".transfer");
const sort_button = document.querySelector(".btn-sort");
const movementContainer = document.querySelector(".movements");

const transferTo = document.querySelector(".transferTo_value");
const transferAmount = document.querySelector(".transferAmount");

const app = document.querySelector(".app");

let currentAccount, timer;

const UpdateUI = function (currentAccount) {
  //DISPLAY MOVEMENTS
  displayMovements(currentAccount);

  //DISPLAY BALANCES
  displayBalance(currentAccount);

  //DISPLAY SUMMARY
  displaySummary(currentAccount);
};

// LOGOUT TIMER
const startLogoutTimer = function () {
  const tick = function () {
    const min = Math.trunc(time / 60)
      .toString()
      .padStart(2, 0);
    const sec = (time % 60).toString().padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      label_welcome.textContent = "Log in to get started";
      app.style.opacity = 0;
    }
    time--;
  };
  let time = 300;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// LOGIN EVENT
login_form.addEventListener("submit", (e) => {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc?.username === form_input_user.value
  );
  if (
    currentAccount?.username === form_input_user.value &&
    currentAccount?.pin === Number(form_input_password.value)
  ) {
    label_welcome.textContent = `Welcome ${
      currentAccount.owner.split(" ")[0]
    }!`;

    const now = new Date();
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formated_date = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    label_login_date.textContent = `As of ${formated_date}`;

    form_input_password.blur();

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    UpdateUI(currentAccount);

    form_input_user.value = form_input_password.value = "";

    app.style.opacity = 100;
  }
});

//TRANSFER MONEY
transfer_form.addEventListener("submit", (e) => {
  e.preventDefault();

  const amount = Number(transferAmount.value);
  const receiverAccount = accounts.find(
    (account) => transferTo.value === account.username
  );

  transferAmount.value = transferTo.value = "";
  if (
    amount > 0 &&
    receiverAccount &&
    receiverAccount.username !== currentAccount.username &&
    amount < currentAccount.balance
  ) {
    receiverAccount.movements.push(amount);
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    UpdateUI(currentAccount);

    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

//CLOSE ACCOUNT
closeaccount__form.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === close_input_user.value &&
    currentAccount.pin === Number(close_input_pin.value)
  ) {
    const index = accounts.findIndex(
      (account) => account.username === close_input_user.value
    );
    accounts.splice(index, 1);
    app.style.opacity = 0;
    close_input_user.value = close_input_pin.value = "";
    swal(`Account Closed!!`);
  }
});

//LOAN FORMS
loan_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const loan = Math.floor(loan_input_amount.value);
  if (loan > 0 && loan < currentAccount.balance * 0.5) {
    currentAccount.movements.push(loan);
    const now = new Date().toISOString();
    currentAccount.movementsDates.push(now);
  }
  loan_input_amount.value = "";

  clearInterval(timer);
  timer = startLogoutTimer();
  UpdateUI(currentAccount);
});

//SORT MOVEMENTS
let sorted = false;
sort_button.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//DISPLAY MOVEMENTS
const displayMovements = function (currentAccount, Sort = false) {
  movementContainer.innerHTML = "";

  const mov = Sort
    ? currentAccount.movements.slice().sort((a, b) => a - b)
    : currentAccount.movements;

  mov.map((movement, index) => {
    const formatted_Date = formatDate(
      currentAccount.movementsDates[index],
      currentAccount.locale
    );

    const curr = formatCurrency(
      movement,
      currentAccount.locale,
      currentAccount.currency
    );
    const type = movement < 0 ? "withdrawal" : "deposit";
    const html = `<div class="movement__row">
            <div class="movement__date">
            <div class="movements__type movements__type--${type}">
            ${index + 1} ${type}
            </div>
            <div class="movements__date">${formatted_Date}</div>
            </div>
            <div class="movements__value">${curr}&nbsp;</div>
            </div>`;

    movementContainer.insertAdjacentHTML("afterbegin", html);
  });
};

//DISPLAY SUMMARY
const displaySummary = function (currentAccount) {
  const income = currentAccount.movements
    .filter((deposit) => deposit > 0)
    .reduce((acc, cur) => acc + cur, 0);

  // CALCULATE INCOME
  label_income.textContent = formatCurrency(
    income,
    currentAccount.locale,
    currentAccount.currency
  );

  // CALCULATE WITHDRAWAL
  const withdrawal = currentAccount.movements
    .filter((withdrawal) => withdrawal < 0)
    .reduce((acc, cur) => acc + cur, 0);

  label_outcome.textContent = formatCurrency(
    withdrawal,
    currentAccount.locale,
    currentAccount.currency
  );

  // CALCULATE INTEREST
  const interest = currentAccount.movements
    .filter((deposit) => deposit > 0)
    .map((int) => (int * currentAccount.interestRate) / 100)
    .reduce((acc, cur) => acc + cur, 0);
  label_interest.textContent = formatCurrency(
    interest,
    currentAccount.locale,
    currentAccount.currency
  );
};

//DISPLAY BALANCE
const displayBalance = function (currentAccount) {
  const balance = currentAccount.movements.reduce((acc, cur) => acc + cur, 0);
  currentAccount.balance = balance;
  label_balance.textContent = formatCurrency(
    balance,
    currentAccount.locale,
    currentAccount.currency
  );
};

//UTILITY FUNCTION:

//TO CREATE USER NAME
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsername(accounts);

//FORMAT DATE
const formatDate = function (date, locale) {
  const calcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs(date1 - date2) / (60 * 60 * 24 * 1000));
  };

  const dayspassed = calcDaysPassed(new Date(), new Date(date));

  if (dayspassed === 0) return "TODAY";
  if (dayspassed === 1) return "YESTERDAY";
  if (dayspassed <= 7) return "A WEEK AGO";
  const formatted_Date = new Intl.DateTimeFormat(locale).format(new Date(date));
  return formatted_Date;
};

//FORMAT CURRENCIES

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

//TEST CREDENTIAL;
const Cred = function () {
  swal(
    "Test Account Credentials",
    `{ user: "aj", pin: 1111 }
      { user: "jr", pin: 2222 }`
  );
  login_form.removeEventListener("click", Cred);
};

login_form.addEventListener("click", Cred);
