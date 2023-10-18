import categoryObject from "../data/categoryObject.js";
import completePacksPreMadeList from "../data/completePacksPreMadeLists.js";

import {
  postItem,
  deleteItem,
  updateItem,
  getList,
  travelTypeElement,
  PostLogoutUser,
  deleteAllItems,
} from "../api/apiRequests.js";

import {
  removeClassFromTableHeader,
  getPercentagePacked,
  getTextContent,
  getIntegerTextContent,
  getIfCheckboxChecked,
  getEmojiTextContent,
  getNextId,
} from "../utils/functionUtils.js";

import {
  table,
  tableHeaders,
  itemCountsElement,
  userTextElement,
  registerButton,
  loginButton,
  logoutButton,
} from "./uiVariables.js";

let ascendingSortedObject = {};

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (itemName, quantity, category, id, is_packed = false) => {
  let item = [
    `${categoryObject[category]} - ${itemName}`,
    quantity,
    category,
    is_packed,
  ];
  let row = table.insertRow();

  row.setAttribute("data-row-id", id);

  for (let i = 0; i < item.length; i++) {
    let cell = row.insertCell(i);
    if (i === item.length - 1 && typeof item[i] === "boolean") {
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item[i];

      //Esse title será usado para ordenar os checkbox
      checkbox.title = item[i] ? "Checked" : "Unchecked";

      cell.appendChild(checkbox);
    } else {
      cell.textContent = item[i];
    }
  }
  insertButton(row.insertCell(-1));

  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
};

/*
    --------------------------------------------------------------------------------------
    Função para remover um item da lista de acordo com o click no botão close
    --------------------------------------------------------------------------------------
  */

const deleteRow = (event) => {
  if (event.target.classList.contains("close")) {
    let tableRow = event.target.parentElement.parentElement;
    const id = tableRow.getAttribute("data-row-id");
    tableRow.remove();
    deleteItem(id);
    updateItemCount();
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para alterar um item da lista de acordo com o click no checkbox
  --------------------------------------------------------------------------------------
*/
function updateElement(event) {
  {
    if (event.target.type === "checkbox") {
      let checkbox = event.target;
      let tr = checkbox.closest("tr");
      let rowId = tr.getAttribute("data-row-id");
      let checked = checkbox.checked ? "checked" : "unchecked";
      checkbox.setAttribute("title", checked);
      updateItem(checkbox.checked, rowId);
      updateItemCount();
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let button = document.createElement("button");
  let txt = document.createTextNode("\u00D7");
  button.className = "close";
  button.appendChild(txt);
  parent.appendChild(button);
};

/*
  --------------------------------------------------------------------------------------
  Função para remover todos os items da lista e da API
  --------------------------------------------------------------------------------------
*/
const removeAllElements = () => {
  const elementsToRemove = table.querySelectorAll("tr[data-row-id]");
  elementsToRemove.forEach((element) => {
    element.remove();
  });
  updateItemCount();
};

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputItem = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputCategory = document.getElementById("newCategory").value;

  if (inputItem === "") {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    let id = getNextId();
    insertList(inputItem, inputQuantity, inputCategory, id);
    postItem(inputItem, inputQuantity, inputCategory);
    updateItemCount();
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para atualizar a contagem dos itens.
  --------------------------------------------------------------------------------------
*/

function updateItemCount() {
  const percentagePackedDictionary = getPercentagePacked();
  const percentage = Math.round(
    (percentagePackedDictionary.checkedItems /
      percentagePackedDictionary.totalItems) *
      100
  );

  const itemCountText =
    percentage === 100
      ? `✈️ Você já empacotou todos os itens da sua lista!`
      : percentagePackedDictionary.totalItems
      ? `💼 Você tem ${percentagePackedDictionary.totalItems} itens na sua lista, e você já empacotou ${percentagePackedDictionary.checkedItems} (${percentage}%)`
      : `Comece a adicionar itens à sua bagagem! 💼`;

  itemCountsElement.textContent = itemCountText;
}

/*
  --------------------------------------------------------------------------------------
  Função que atualiza o value do droplist de tipo de viagem e armazena seu valor no localStorage.
  --------------------------------------------------------------------------------------
*/

function setTravelType() {
  const storedTravelType = localStorage.getItem("typeOfTravelId");

  travelTypeElement.value = storedTravelType ? storedTravelType : "1";

  if (!storedTravelType) {
    localStorage.setItem("typeOfTravelId", travelTypeElement.value);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para atualizar a tabela ao mudar o tipo da viagem.
  --------------------------------------------------------------------------------------
*/

function onChangeTravelType() {
  // Update the typeOfTravel variable when the selection changes
  removeAllElements();
  getList();
  removeClassFromTableHeader(tableHeaders);
  localStorage.setItem("typeOfTravelId", travelTypeElement.value);
}

/*
    --------------------------------------------------------------------------------------
    Função atualizar a barra de usuário (Login, registro, logout e mensagem ao usuário logado).
    --------------------------------------------------------------------------------------
*/

// Function to update userTextElement with the username
function updateUserHeader() {
  // Check if username and JWT exist in localStorage
  const username = localStorage.getItem("username");
  const jwt = localStorage.getItem("JWT");
  registerButton;
  loginButton;
  logoutButton;

  if (username && jwt) {
    // Update the userTextElement with the username
    userTextElement.textContent = `Bem Vindo(a), ${username}!`;
    registerButton.style.display = "none";
    loginButton.style.display = "none";
  } else {
    userTextElement.textContent = `Faça Login para carregar e armazenar seus próprios dados!`;
    logoutButton.style.display = "none";
  }
}

/*
    --------------------------------------------------------------------------------------
    Função para realizar o Logout do usuário.
    --------------------------------------------------------------------------------------
*/

function logOutUser() {
  PostLogoutUser();
  localStorage.removeItem("JWT");
  localStorage.removeItem("username");
}

/*
    --------------------------------------------------------------------------------------
    Função para carregar os itens da lista pronta na UI.
    --------------------------------------------------------------------------------------
*/

function insertPreMadeList() {
  const typeOfTravelId = localStorage.getItem("typeOfTravelId");

  removeItemsUIAndAPI(typeOfTravelId);

  //Gerando a lista personalizada para o tipo de viagem.
  const ItemsListObject = completePacksPreMadeList[typeOfTravelId];
  ItemsListObject.forEach((item) => {
    const { id, name, quantity, category, is_packed } = item;

    // Manda um post request para a API.
    postItem(name, quantity, category);

    // Call the insertList function for each item
    insertList(name, quantity, category, id, is_packed);

    updateItemCount();
  });
}

/*
    --------------------------------------------------------------------------------------
    Função para remover os itens da lista da pack do usuario da UI e da API.
    --------------------------------------------------------------------------------------
*/

function removeItemsUIAndAPI(pack_id) {
  //Removendo todos os itens antes de adiciona-los.
  removeAllElements();
  // Delete requesta para a API, deletando todos os itens da pack do usuario.
  deleteAllItems(pack_id);
}

/*
    --------------------------------------------------------------------------------------
    Função adicionar aviso aos usuários mobile.
    --------------------------------------------------------------------------------------
*/
function loadWarningMobileUsers() {
  const minimumWidth = 768;

  if (window.innerWidth < minimumWidth) {
    window.location.href = "../pages/mobile.html";
  }
}
/*
  --------------------------------------------------------------------------------------
  Funções para Ordenar os itens da tabela
  --------------------------------------------------------------------------------------
*/

/*
    --------------------------------------------------------------------------------------
    Função para adicionar Event Handlers para ordenar a tabela quando clicado
    --------------------------------------------------------------------------------------
*/

function initializeTableHeaderSorting() {
  for (let columnIndex = 0; columnIndex < tableHeaders.length; columnIndex++) {
    let tableColumn = tableHeaders[columnIndex];
    let tableColumnType = tableColumn.getAttribute("column-type");
    if (!tableColumnType) {
      continue;
    }
    tableColumn.addEventListener(
      "click",
      createSortHandler(columnIndex, tableColumnType)
    );
  }
}

/*
    --------------------------------------------------------------------------------------
    Função para adicionar a classe nos headers que serão ordenados e chamar a função que ordena
    --------------------------------------------------------------------------------------
*/

function createSortHandler(columnIndex, tableColumnType) {
  return function () {
    sortTable(columnIndex, tableColumnType);
    ascendingSortedObject[columnIndex] = !ascendingSortedObject[columnIndex];

    const headersArray = Array.from(tableHeaders);

    //Retorna na última coluna, pois será a coluna de deletar o item.
    if (columnIndex === headersArray.length - 1) {
      return;
    }
    headersArray.forEach((th) => {
      th.classList.remove("th-sort-asc", "th-sort-desc");
    });

    tableHeaders[columnIndex].classList.toggle(
      "th-sort-asc",
      !ascendingSortedObject[columnIndex]
    );
    tableHeaders[columnIndex].classList.toggle(
      "th-sort-desc",
      ascendingSortedObject[columnIndex]
    );
  };
}

/*
    --------------------------------------------------------------------------------------
    Função para ordenar a tabela de acordo com o tipo da coluna
    --------------------------------------------------------------------------------------
*/
function sortTable(columnIndex, tableColumnType) {
  let rows, switching, i, x, y, shouldSwitch;
  switching = true;
  let dataTransformFunction;

  if (tableColumnType === "string") {
    dataTransformFunction = getTextContent;
  }

  if (tableColumnType === "emoji-string") {
    dataTransformFunction = getEmojiTextContent;
  }

  if (tableColumnType === "integer") {
    dataTransformFunction = getIntegerTextContent;
  }

  if (tableColumnType === "checkbox") {
    dataTransformFunction = getIfCheckboxChecked;
  }

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      const xValue = dataTransformFunction(
        rows[i].getElementsByTagName("td")[columnIndex]
      );
      const yValue = dataTransformFunction(
        rows[i + 1].getElementsByTagName("td")[columnIndex]
      );

      if (ascendingSortedObject[columnIndex]) {
        if (xValue > yValue) {
          shouldSwitch = true;
          break;
        }
      } else if (!ascendingSortedObject[columnIndex]) {
        if (xValue < yValue) {
          shouldSwitch = true;
          break;
        }
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

export {
  insertList,
  updateElement,
  insertButton,
  removeAllElements,
  sortTable,
  deleteRow,
  newItem,
  onChangeTravelType,
  updateItemCount,
  initializeTableHeaderSorting,
  setTravelType,
  updateUserHeader,
  logOutUser,
  insertPreMadeList,
  removeItemsUIAndAPI,
  loadWarningMobileUsers,
};
