/*
  --------------------------------------------------------------------------------------
  Página inicial index.html
  --------------------------------------------------------------------------------------
*/

const itemCountsElement = document.getElementById("itemCounts");
const table = document.getElementById("myTable");
const addButton = document.getElementById("add-item-button");
const tableHeaders = document.getElementsByTagName("th");
let travelTypeElement = document.getElementById("travelTypeSelect");
const userTextElement = document.getElementById("user-text");
let registerButton = document.getElementById("register-button");
let loginButton = document.getElementById("login-button");
let logoutButton = document.getElementById("logout-button");
let loadItemListButton = document.getElementById("load-item-list-button");
let deleteItemListButton = document.getElementById("delete-item-list-button");

/*
  --------------------------------------------------------------------------------------
  Página  register.html
  --------------------------------------------------------------------------------------
*/

const passwordField1 = document.getElementById("password_1");
const passwordField2 = document.getElementById("password_2");
const usernameField = document.getElementById("username-field");
const emailField = document.getElementById("email-field");
const apiMessageDiv = document.getElementById("api-message");
const registrationSubmitButton = document.getElementById("submitButton");

/*
  --------------------------------------------------------------------------------------
  Página  login.html
  --------------------------------------------------------------------------------------
*/
const loginSubmitButton = document.getElementById("submitButton");
const passwordInput = document.getElementById("password");

export {
  itemCountsElement,
  table,
  addButton,
  tableHeaders,
  travelTypeElement,
  userTextElement,
  registerButton,
  loginButton,
  logoutButton,
  passwordField1,
  passwordField2,
  usernameField,
  apiMessageDiv,
  registrationSubmitButton,
  loginSubmitButton,
  passwordInput,
  loadItemListButton,
  deleteItemListButton,
  emailField,
};
