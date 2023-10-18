import apiBaseURL from "../api/apiBaseURL.js";
import { PostLoginUser } from "../api/apiRequests.js";
import {
  loginSubmitButton,
  usernameField,
  passwordInput,
} from "../ui/uiVariables.js";

async function handleFormSubmission(event) {
  event.preventDefault();

  try {
    const data = await PostLoginUser();

    usernameField.value = "";
    passwordInput.value = "";
  } catch (error) {
    console.error("Error:", error);
  }
}

// Add event listener to the form submission
loginSubmitButton.addEventListener("click", handleFormSubmission);
