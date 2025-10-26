const editContactFormElement = document.getElementById("edit-contact-form");
let dataContacts = loadContactsFromStorage();
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = Number(params.get("id"));

function initializeEditContactPage() {
  // Initialize search components
  const desktopSearch = new SearchComponent(
    "search-container-desktop",
    "desktop"
  );
  const mobileSearch = new SearchComponent("search-container-mobile", "mobile");

  desktopSearch.initialize();
  mobileSearch.initialize();

  // Setup mobile menu
  setupMobileMenu();

  // Setup form event listeners
  setupFormEventListeners();

  // Render contact data
  renderEditContactById(id);
}

function setupFormEventListeners() {
  // Form submit event
  editContactFormElement.addEventListener("submit", function (event) {
    event.preventDefault();
    editContactById(dataContacts, id, getFormData());
  });

  // Cancel button event
  const cancelButton = document.querySelector(".cancel-button");
  if (cancelButton) {
    cancelButton.addEventListener("click", function () {
      goToDashboardPage();
    });
  }
}

function renderEditContactById(id) {
  const contact = getContactDetailsById(dataContacts, id);

  if (!contact) {
    showNotification("Contact not found", "error");
    setTimeout(() => {
      goToDashboardPage();
    }, 300);
    return;
  }

  // Populate form fields
  document.getElementById("full-name").value = contact.fullName || "";
  document.getElementById("phone").value = contact.phone || "";
  document.getElementById("email").value = contact.email || "";
  document.getElementById("address").value = contact.address || "";

  if (contact.birthdate) {
    document.getElementById("birthdate").valueAsDate = new Date(
      contact.birthdate
    );
  }

  // Set labels
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
    fullName: formData.get("full-name").toString(),
    phone: formData.get("phone")?.toString() || null,
    email: formData.get("email")?.toString() || null,
    address: formData.get("address")?.toString() || null,
    birthdate: formData.get("birthdate")
      ? new Date(formData.get("birthdate"))
      : null,
    labels: labels,
  };
}

// Initial Render
document.addEventListener("DOMContentLoaded", function () {
  initializeEditContactPage();
  feather.replace();
});
