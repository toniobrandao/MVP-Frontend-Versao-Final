import { getList, travelTypeElement } from "./api/apiRequests.js";

import {
  updateElement,
  newItem,
  onChangeTravelType,
  initializeTableHeaderSorting,
  setTravelType,
  deleteRow,
  updateUserHeader,
  logOutUser,
  insertPreMadeList,
  removeItemsUIAndAPI,
  loadWarningMobileUsers,
} from "./ui/uiFunctions.js";

import {
  table,
  addButton,
  logoutButton,
  loadItemListButton,
  deleteItemListButton,
} from "./ui/uiVariables.js";

/*
  --------------------------------------------------------------------------------------
  Setando as variáveis
  --------------------------------------------------------------------------------------
*/
//Esta função verifica se um id de tipo de viagem está armazenado no navegador com localStorage;
//se não estiver, define o valor padrão como "1" e o armazena para uso futuro.
setTravelType();

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/

getList();

/*
  --------------------------------------------------------------------------------------
  Adicionando os Event Handlers
  --------------------------------------------------------------------------------------
*/

window.addEventListener("load", loadWarningMobileUsers);

//Event handler para, ao clicar no botão adicionar,
//adicionar um novo item à tabela e fazer um post request para a API.
addButton.addEventListener("click", newItem);

//Event handler para, ao checar o checkbox, mandar um put request para a API.
table.addEventListener("click", (e) => updateElement(e));

//Event handler para modificar o id do tipo da viagem ao alterar o droplist.
travelTypeElement.addEventListener("change", onChangeTravelType);

//Event handlers para permitir a ordenação da coluna da tabela ao serem clicados.
initializeTableHeaderSorting();

//Atualiza o cabeçalho condicionalmente com os dados do usuário (login, criar conta, logout out)

// Event listener for the "DOMContentLoaded" event
document.addEventListener("DOMContentLoaded", () => updateUserHeader());

//Event handler para o botão de logout
logoutButton.addEventListener("click", logOutUser);

//Event handler para o botão de carregar lista pronta.
loadItemListButton.addEventListener("click", insertPreMadeList);

//Event handler para botão de limpar lista.
deleteItemListButton.addEventListener("click", () => {
  const typeOfTravelId = localStorage.getItem("typeOfTravelId");
  removeItemsUIAndAPI(typeOfTravelId);
});

//Event Handler para deletar um item da tabela e fazer um delete request
// ao clicar o botão de delete
table.addEventListener("click", (e) => deleteRow(e));
