const addContactFormElement = document.getElementById("add-contact-form");

let dataContacts = loadContactsFromStorage();

addContactFormElement.addEventListener("submit", function (event) {
  event.preventDefault();
  addContact(dataContacts, getFormData());
});

document.addEventListener("DOMContentLoaded", function () {
  const cancelButton = document.querySelector('button[type="button"]');

  if (cancelButton) {
    cancelButton.addEventListener("click", function () {
      goToDashboardPage();
    });
  }
});

function getFormData() {
  const formData = new FormData(addContactFormElement);
  const labels = [];

  if (formData.get("client")) labels.push("client");
  if (formData.get("family")) labels.push("family");
  if (formData.get("friend")) labels.push("friend");
  if (formData.get("work")) labels.push("work");

  const fullName = formData.get("fullName");
  const initials = getInitials(fullName);
  const backgroundColor = getColorForInitial(initials);

  return {
    fullName: fullName,
    phone: formData.get("phone") || null,
    email: formData.get("email") || null,
    address: formData.get("address") || null,
    birthdate: formData.get("birthdate") || null,
    labels: labels,
    color: backgroundColor,
  };
}
