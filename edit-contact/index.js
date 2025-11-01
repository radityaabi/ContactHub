const editContactFormElement = document.getElementById("edit-contact-form");
let dataContacts = loadContactsFromStorage();
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = Number(params.get("id"));

function initializeEditContactPage() {
  // Initialize search component
  const search = new SearchComponent("search-container");
  search.initialize();

  // Initialize mobile navigation
  initializeMobileNavigation();

  // Initialize label filters
  initializeLabelFilters();

  // Setup form event listeners
  setupFormEventListeners();

  // Render contact data
  renderEditContactById(id);

  // Update label filters UI based on URL parameters
  const labelsParam = new URLSearchParams(window.location.search).get("labels");
  updateLabelFiltersUI(labelsParam);
  updateActiveFiltersDisplay(labelsParam);
}

function setupFormEventListeners() {
  // Form submit event
  if (editContactFormElement) {
    editContactFormElement.addEventListener("submit", function (event) {
      event.preventDefault();
      editContactById(dataContacts, id, getFormData());
    });
  }

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
    }, 2000);
    return;
  }

  // Populate form fields
  document.getElementById("full-name").value = contact.fullName || "";
  document.getElementById("phone").value = contact.phone || "";
  document.getElementById("email").value = contact.email || "";
  document.getElementById("address").value = contact.address || "";

  if (contact.birthdate) {
    const birthdate = new Date(contact.birthdate);
    const formattedDate = birthdate.toISOString().split("T")[0];
    document.getElementById("birthdate").value = formattedDate;
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
