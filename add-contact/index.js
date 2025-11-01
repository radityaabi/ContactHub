const addContactFormElement = document.getElementById("add-contact-form");

let dataContacts = loadContactsFromStorage();

function initializeAddContactPage() {
  // Initialize search component
  const search = new SearchComponent("search-container");
  search.initialize();

  // Initialize mobile navigation
  initializeMobileNavigation();

  // Initialize label filters
  initializeLabelFilters();

  // Setup form event listeners
  setupFormEventListeners();

  // Update label filters UI based on URL parameters
  const labelsParam = new URLSearchParams(window.location.search).get("labels");
  updateLabelFiltersUI(labelsParam);
  updateActiveFiltersDisplay(labelsParam);
}

function setupFormEventListeners() {
  // Form submit event
  if (addContactFormElement) {
    addContactFormElement.addEventListener("submit", function (event) {
      event.preventDefault();
      addContact(dataContacts, getFormData());
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

function getFormData() {
  const formData = new FormData(addContactFormElement);
  const labels = [];

  if (formData.get("client")) labels.push("client");
  if (formData.get("family")) labels.push("family");
  if (formData.get("friend")) labels.push("friend");
  if (formData.get("work")) labels.push("work");

  const fullName = formData.get("full-name").toString();
  const initials = getInitials(fullName);
  const backgroundColor = getColorForInitial(initials);

  return {
    fullName: fullName,
    phone: formData.get("phone")?.toString() || null,
    email: formData.get("email")?.toString() || null,
    address: formData.get("address")?.toString() || null,
    birthdate: formData.get("birthdate")
      ? new Date(formData.get("birthdate"))
      : null,
    labels: labels,
    color: backgroundColor,
  };
}

// Initial render
document.addEventListener("DOMContentLoaded", function () {
  initializeAddContactPage();
  feather.replace();
});
