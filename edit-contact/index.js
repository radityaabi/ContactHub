const editContactFormElement = document.getElementById("edit-contact-form");
editContactFormElement.reset();

editContactFormElement.addEventListener("submit", function (event) {
  event.preventDefault();
  editContactById(dataContacts, id, getFormData());
});

document.addEventListener("DOMContentLoaded", function () {
  const cancelButton = document.querySelector('button[type="button"]');

  if (cancelButton) {
    cancelButton.addEventListener("click", function () {
      goToDashboardPage();
    });
  }
});

const dataContacts = loadContactsFromStorage();
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = Number(params.get("id"));

renderEditContactById(id);

function renderEditContactById(id) {
  const contact = getContactDetailsById(dataContacts, id);

  document.getElementById("fullName").defaultValue = contact.fullName;
  document.getElementById("phone").defaultValue = contact.phone ?? "";
  document.getElementById("email").defaultValue = contact.email ?? "";
  document.getElementById("address").defaultValue = contact.address ?? "";

  if (contact.birthdate) {
    document.getElementById("birthdate").valueAsDate = new Date(
      contact.birthdate
    );
  }

  if (contact.labels) {
    contact.labels.forEach((label) => {
      const checkbox = document.getElementById(label);

      if (checkbox) {
        checkbox.checked = true;
      }
    });
  }
}

function getFormData() {
  const formData = new FormData(editContactFormElement);
  const labels = [];

  if (formData.get("client")) labels.push("client");
  if (formData.get("family")) labels.push("family");
  if (formData.get("friend")) labels.push("friend");
  if (formData.get("work")) labels.push("work");

  return {
    fullName: formData.get("fullName"),
    phone: formData.get("phone") || null,
    email: formData.get("email") || null,
    address: formData.get("address") || null,
    birthdate: formData.get("birthdate") || null,
    labels: labels,
  };
}
