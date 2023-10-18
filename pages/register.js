import { PostRegisterUser } from "../api/apiRequests.js";
import {
  registrationSubmitButton,
  usernameField,
  emailField,
} from "../ui/uiVariables.js";

function handleFormSubmission(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Check if passwords match
  const password1 = document.getElementById("password_1");
  const password2 = document.getElementById("password_2");

  if (
    usernameField.value === "" ||
    emailField.value === "" ||
    password1.value === "" ||
    password2.value === ""
  ) {
    alert("Preencha todos os campos!");
    return;
  }

  if (password1.value === password2.value) {
    // Retrieve the username and password

    // Call the API function to register the user
    PostRegisterUser()
      .then(() => {
        // Empty the username and password fields
        usernameField.value = "";
        emailField.value = "";
        password1.value = "";
        password2.value = "";
      })
      .catch((error) => {
        console.error("Error registering user:", error);
      });
  } else {
    alert("Senhas diferentes, repita a senha");
    password1.value = "";
    password2.value = "";
  }
}

// Add event listener to the form submission
registrationSubmitButton.addEventListener("click", handleFormSubmission);
