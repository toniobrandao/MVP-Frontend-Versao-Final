import { updateUserPassword } from "../api/apiRequests.js";

const emailField = document.getElementById("email-field");
const submitButton = document.getElementById("submitButton");

async function handleFormSubmission(event) {
  event.preventDefault();

  try {
    const emailValue = emailField.value;
    emailField.value = "";
    await updateUserPassword(emailValue);
  } catch (error) {
    console.error("Error:", error);
  }
}

submitButton.addEventListener("click", handleFormSubmission);
