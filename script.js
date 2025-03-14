'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Joao Mansano',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2024-11-18T21:31:17.178Z',
    '2024-12-23T07:42:02.383Z',
    '2025-01-28T09:15:04.904Z',
    '2025-04-01T10:17:24.185Z',
    '2025-05-08T14:11:59.604Z',
    '2025-02-21T17:01:17.194Z',
    '2025-02-25T23:36:17.929Z',
    '2025-02-24T10:51:36.790Z',
  ],
  currency: 'BRL',
  locale: 'pt-BR', // de-DE
};

const account2 = {
  owner: 'Martina Suarez',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2024-11-01T13:15:33.035Z',
    '2024-11-30T09:48:16.867Z',
    '2024-12-25T06:04:23.907Z',
    '2025-01-25T14:18:46.235Z',
    '2025-02-05T16:33:06.386Z',
    '2025-04-10T14:43:26.374Z',
    '2025-06-25T18:49:59.371Z',
    '2025-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'es-SP',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnLogOut = document.querySelector('.logout__btn');
const btnLogOutIcon = document.querySelector('.logout__icon');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
  };
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, '0');
    // const year = date.getFullYear();

    // return `${day}/${month}/${year}`;

    //Same funcionalitu, but using API
    return Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  //We clean the container Movements.

  const combinedMovimentsDates = acc.movements.map((mov, i) => ({
    movement: mov,
    movementDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovimentsDates.sort((a, b) => a.movement - b.movement);

  combinedMovimentsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;

    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const intlFormMov = formatCur(movement, acc.locale, acc.currency);

    const html = ` <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${intlFormMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} EUR`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = account.movements
    .filter((mov => mov > 0) && (mov => mov >= 1))
    .map(deposit => (deposit * account.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(
    interest,
    account.locale,
    account.currency
  );
};

//Test of using reduce
/*
const max = function (movements) {
  return movements.reduce((acc, mov) => {
    if (acc > mov) return acc;
    else return mov;
  }, movements[0]);
};

console.log(max(account1.movements));
*/

//Creating Usernames for the accounts

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUsernames(accounts);
console.log(accounts);

const updateUi = function (account) {
  //Display Balance of the account
  calcPrintBalance(account);

  //Display Movements of the account
  displayMovements(account);

  //Display Summary of the account
  calcDisplaySummary(account);
};

const startLogOutTimer = function () {
  const loggedInTime = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    let timer;

    //Printing the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    //Decreasing the time
    time--;

    //if 0 seconds, let log out the user
    if (time === 0) {
      clearInterval(timer);

      labelWelcome.textContent = 'Closing the app during ';
      containerApp.style.opacity = 0;
    }
  };

  //Initializing it with 5 minutes remaining
  let time = 300;

  //Call the timer every second
  loggedInTime();
  const timer = setInterval(loggedInTime, 1000);

  return timer;
};

//Testing the function above

//logIn

let currentAccount;

//Fake Always LogIn
// currentAccount = account1;
// console.log(`Fake login sendo executado: ${currentAccount}`);
// updateUi(currentAccount);
// containerApp.style.opacity = 100;

inputLoginPin.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    btnLogin.click();
    console.log('keypress event no inputPin');
  }
});

inputLoginUsername.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    btnLogin.click();
  }
});

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  console.log('Botão de login clicado');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    //Current date and time
    const now = new Date();
    const dateTime = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    const locale = navigator.language;
    console.log(locale);

    labelDate.textContent = Intl.DateTimeFormat(
      currentAccount.locale,
      dateTime
    ).format(now);

    updateUi(currentAccount);

    //Clear the texts of inputLogin and inputPin
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // updateUi(currentAccount);
    console.log('LogIn Efetuated');
    startLogOutTimer();
  }

  //Starting the logOut button
  btnLogOut.removeAttribute('disabled');
  btnLogOut.style.cursor = 'pointer';
  btnLogOutIcon.style.opacity = 100;
});

btnLogOut.addEventListener('click', function (e) {
  e.preventDefault();

  console.log(' Evento começado!!');
  // btnLogOut.style.cursor = 'default';
  // btnLogOutIcon.style.opacity = 0;

  currentAccount = null;
  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Log in to get started ';

  btnLogOut.style.cursor = 'default';
  btnLogOutIcon.style.opacity = 0;
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Transferences between accounts
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }

  //Adding the current date of the transfer
  currentAccount.movementsDates.push(new Date().toISOString());
  receiverAcc.movementsDates.push(new Date().toISOString());

  //Updating the UI
  updateUi(currentAccount);

  //Cleaning the transfer to spaces
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  inputTransferTo.blur();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      //Add a positive movement at the user accounts
      currentAccount.movements.push(amount);

      //Adding the current date of the transfer
      currentAccount.movementsDates.push(new Date().toISOString());

      //Updating the UI
      updateUi(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Working on deleting...');

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    console.log("That's sad...We're deleting your account!");

    //Using findIndex to identify the correct account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //Deleting the account
    accounts.splice(index, 1);
    // console.log(accounts);

    //Hiding the UI
    containerApp.style.opacity = 0;
  } else if (
    inputCloseUsername.value != currentAccount.username &&
    +inputClosePin.value !== currentAccount.pin
  ) {
    alert('Wrong Username and password, try again!');
  } else if (+inputClosePin.value != currentAccount.pin) {
    alert('Wrong password, try again!');
  } else if (inputCloseUsername.value != currentAccount.username) {
    alert('Wrong Username, try again!!');
  }

  //Cleaning the Close inputs
  inputCloseUsername.value = '';
  inputClosePin.value = '';
  inputClosePin.blur();
  labelWelcome.textContent = 'Log in to get started ';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault;
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['BRL', 'Reais'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//ARRAY METHOD PRACTICE

//1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur);

console.log(bankDepositSum);

//2.
const numDeposites = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;

console.log(`The number of deposites greater tahn 1000 is ${numDeposites}.`);

//3.
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposits += cur) : (sums.withdrawls += cur);
      return sums;
    },
    { deposits: 0, withdrawls: 0 }
  );

console.log(sums);

//4.
const convertedTittleCase = function (title) {
  const excepetions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

  const tittleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      excepetions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    );

  return tittleCase;
};

console.log(convertedTittleCase("There it's a good tittle"));
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const num = 140252532;
console.log(new Intl.NumberFormat('pt-BR').format(num));
console.log(new Intl.NumberFormat('en-US').format(num));
