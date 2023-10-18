import { insertList, updateItemCount } from "../ui/uiFunctions.js";
import {
  travelTypeElement,
  passwordField1,
  usernameField,
  apiMessageDiv,
  passwordInput,
  emailField,
} from "../ui/uiVariables.js";
import apiBaseURL from "./apiBaseURL.js";

/*
  --------------------------------------------------------------------------------------
  GET REQUEST: Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = `${apiBaseURL}/pack/${travelTypeElement.value}/user`;
  const JWT = localStorage.getItem("JWT");

  let headers = {
    "Content-Type": "application/json",
  };

  if (!JWT) {
    // console.error("JWT not found in localStorage.");
    updateItemCount();
    return;
  }

  fetch(url, {
    method: "get",
    headers: { Authorization: `Bearer ${JWT}` },
  })
    .then((response) => response.json())
    .then((data) => {
      data.items.forEach((item) => {
        insertList(
          item.name,
          item.quantity,
          item.category,
          item.id,
          item.is_packed
        );
      });
      updateItemCount();
    })

    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  POST REQUEST: Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputCategory) => {
  let typeOfTravelId = travelTypeElement.value;
  const JWT = localStorage.getItem("JWT");

  if (!JWT) {
    // console.error("JWT not found in localStorage. Item not posted.");
    return;
  }
  const itemData = {
    name: inputProduct,
    quantity: inputQuantity,
    category: inputCategory,
    is_packed: false,
    pack_id: typeOfTravelId,
  };

  const jsonData = JSON.stringify(itemData);

  let url = `${apiBaseURL}/item`;
  fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT}`,
    },
    body: jsonData,
  })
    .then((response) => response.json())
    .then((data) => {})
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  PUT REQUEST: Função para modificar um item na lista do servidor via requisição PUT
  --------------------------------------------------------------------------------------
*/
const updateItem = async (is_packed, item_id) => {
  const JWT = localStorage.getItem("JWT");
  if (!JWT) {
    // console.error("JWT not found in localStorage. Item not posted.");
    return;
  }
  const itemData = { is_packed: is_packed };
  // Convert the object to a JSON string
  const jsonData = JSON.stringify(itemData);

  let url = `${apiBaseURL}/item/${item_id}`;
  fetch(url, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT}`,
    },
    body: jsonData,
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
  --------------------------------------------------------------------------------------
  DELETE REQUEST: Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (itemId) => {
  const JWT = localStorage.getItem("JWT");
  if (!JWT) {
    // console.error("JWT not found in localStorage. Item not posted.");
    return;
  }
  let url = `${apiBaseURL}/item/${itemId}`;
  fetch(url, {
    method: "delete",
    headers: { Authorization: `Bearer ${JWT}` },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
--------------------------------------------------------------------------------------
POST REQUEST: Função para fazer o logout do usuário no servidor via requisição POST.
--------------------------------------------------------------------------------------
*/

const PostLogoutUser = async () => {
  const JWT = localStorage.getItem("JWT");
  console.log("User logged out.");
  if (!JWT) {
    console.error("JWT not found in localStorage. Item not posted.");
    return;
  }

  let url = `${apiBaseURL}/logout`;
  fetch(url, {
    method: "post",
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

/*
--------------------------------------------------------------------------------------
POST REQUEST: Função para fazer o login do usuário no servidor via requisição POST.
--------------------------------------------------------------------------------------
*/
const PostLoginUser = async () => {
  const url = `${apiBaseURL}/login`; // Replace with your API endpoint URL
  const username = usernameField.value;
  const password = passwordInput.value;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    usernameField.value = "";
    passwordInput.value = "";

    if (!data.access_token) {
      apiMessageDiv.textContent = "Usuário ou senha incorretos!";
      return;
    }

    localStorage.setItem("JWT", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("username", data.username);

    // Redirect to index.html
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Error sending data to API:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

/*
--------------------------------------------------------------------------------------
POST REQUEST: Função para registrar um usuário novo no servidor via requisição POST.
--------------------------------------------------------------------------------------
*/
const PostRegisterUser = async () => {
  const username = usernameField.value;
  const password = passwordField1.value;
  const email = emailField.value;

  console.log(email);
  const RegistrationFormData = {
    username,
    email,
    password,
  };

  const jsonData = JSON.stringify(RegistrationFormData);

  console.log(jsonData);
  const url = `${apiBaseURL}/register`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    });

    const data = await response.json();

    if (data.code === 201) {
      window.location.href = "login.html";
      alert("Usuário Criado com sucesso!");
    } else if (data.code === 409) {
      apiMessageDiv.textContent =
        "Já existe um usuário com esse nome ou e-mail !";
    }
  } catch (error) {
    console.error("Error sending data to API:", error);
    throw error;
  }
};

/*
  --------------------------------------------------------------------------------------
  DELETE REQUEST: Função para deletar todos items da pack do usuário do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/

const deleteAllItems = (packId) => {
  const JWT = localStorage.getItem("JWT");
  if (!JWT) {
    // console.error("JWT not found in localStorage. Item not posted.");
    return;
  }
  let url = `${apiBaseURL}/items/${packId}`;

  fetch(url, {
    method: "delete",
    headers: { Authorization: `Bearer ${JWT}` },
  }).catch((error) => {
    console.error("Error:", error);
  });
};

/*
  --------------------------------------------------------------------------------------
  PUT REQUEST: Função para alterar a senha do usuário no servidor via requisição PUT.
  --------------------------------------------------------------------------------------
*/

const updateUserPassword = async (email) => {
  let url = `${apiBaseURL}/user/password_recovery/${email}`;
  apiMessageDiv.textContent = "Carregando...";
  return fetch(url, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status == 404) {
      apiMessageDiv.textContent = "E-mail não asssociado a um usuário!";
    } else if (response.status == 200) {
      apiMessageDiv.textContent = "Nova senha enviada ao e-mail fornecido!";
    }
    return response.json();
  });
};

export {
  getList,
  postItem,
  updateItem,
  deleteItem,
  travelTypeElement,
  PostLogoutUser,
  PostLoginUser,
  PostRegisterUser,
  deleteAllItems,
  updateUserPassword,
};
