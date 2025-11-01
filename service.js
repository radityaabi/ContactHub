// ====================================
// SEARCH POPUP COMPONENT
// ====================================

class SearchPopup {
  constructor(searchInputId, resultsContainerId) {
    this.searchInputId = searchInputId;
    this.resultsContainerId = resultsContainerId;
    this.searchTimeout = null;
    this.debounceDelay = 200;
    this.isOpen = false;
  }

  initialize() {
    const searchInput = document.getElementById(this.searchInputId);
    const resultsContainer = document.getElementById(this.resultsContainerId);

    if (!searchInput) {
      console.error("Search input not found:", this.searchInputId);
      return;
    }

    if (!resultsContainer) {
      console.error("Results container not found:", this.resultsContainerId);
      return;
    }

    searchInput.addEventListener("input", (event) => {
      this.handleSearchInput(event.target.value);
    });

    searchInput.addEventListener("focus", () => {
      const currentValue = searchInput.value.trim();
      if (currentValue) {
        this.showResults(currentValue);
      } else {
        // Show recent contacts or empty state when focused with no input
        this.showResults("");
      }
    });

    searchInput.addEventListener("blur", (event) => {
      setTimeout(() => {
        if (!resultsContainer.contains(document.activeElement)) {
          this.hideResults();
        }
      }, 150);
    });

    // Reposition on window resize and scroll
    window.addEventListener("resize", () => {
      if (this.isOpen) {
        this.positionDropdown();
      }
    });

    window.addEventListener("scroll", () => {
      if (this.isOpen) {
        this.positionDropdown();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        !searchInput.contains(event.target) &&
        !resultsContainer.contains(event.target)
      ) {
        this.hideResults();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.hideResults();
        searchInput.blur();
      }
    });
  }

  handleSearchInput(keyword) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      if (keyword.trim()) {
        this.showResults(keyword.trim());
      } else {
        this.hideResults();
      }
    }, this.debounceDelay);
  }

  showResults(keyword) {
    const contacts = loadContactsFromStorage();
    const filteredContacts = keyword
      ? this.searchContacts(contacts, keyword)
      : [];
    this.renderResults(filteredContacts, keyword);
    this.positionDropdown();
    this.isOpen = true;
  }

  positionDropdown() {
    const searchInput = document.getElementById(this.searchInputId);
    const resultsContainer = document.getElementById(this.resultsContainerId);

    if (!searchInput || !resultsContainer) return;

    const inputRect = searchInput.getBoundingClientRect();

    // Position dropdown below search input with fixed positioning
    resultsContainer.style.width = `${inputRect.width}px`;
    resultsContainer.style.left = `${inputRect.left}px`;
    resultsContainer.style.top = `${inputRect.bottom}px`;
    resultsContainer.style.zIndex = "9999";
  }

  hideResults() {
    const resultsContainer = document.getElementById(this.resultsContainerId);
    if (resultsContainer) {
      resultsContainer.classList.add("hidden");
    }
    this.isOpen = false;
  }

  searchContacts(contacts, keyword) {
    const normalizedKeyword = keyword.toLowerCase();

    return contacts
      .filter((contact) => {
        const searchFields = [
          contact.fullName?.toLowerCase(),
          contact.email?.toLowerCase(),
          contact.phone?.toLowerCase(),
        ].filter(Boolean);

        return searchFields.some((field) => field.includes(normalizedKeyword));
      })
      .slice(0, 8);
  }

  renderResults(contacts, keyword) {
    const resultsContainer = document.getElementById(this.resultsContainerId);
    if (!resultsContainer) return;

    if (contacts.length === 0) {
      if (keyword) {
        resultsContainer.innerHTML = `
          <div class="p-4 text-center text-gray-500 bg-white">
            <i data-feather="search" class="w-8 h-8 mx-auto mb-2 text-gray-300"></i>
            <p class="text-sm">No contacts found for "${keyword}"</p>
          </div>
        `;
      } else {
        resultsContainer.innerHTML = `
          <div class="p-4 text-center text-gray-500 bg-white">
            <i data-feather="search" class="w-8 h-8 mx-auto mb-2 text-gray-300"></i>
            <p class="text-sm">Type to search contacts</p>
          </div>
        `;
      }
    } else {
      resultsContainer.innerHTML = contacts
        .map(
          (contact) => `
        <div 
          class="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150 bg-white"
          onmousedown="handleSearchResultClick(${contact.id})"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 ${
              contact.color
            } rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              ${getInitials(contact.fullName)}
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900 truncate">${
                contact.fullName
              }</div>
              ${
                contact.email
                  ? `<div class="text-sm text-gray-500 truncate">${contact.email}</div>`
                  : ""
              }
              ${
                contact.phone
                  ? `<div class="text-sm text-gray-500 truncate">${contact.phone}</div>`
                  : ""
              }
            </div>
          </div>
        </div>
      `
        )
        .join("");
    }

    resultsContainer.classList.remove("hidden");
    feather.replace();
  }
}

// ====================================
// SEARCH COMPONENT
// ====================================

class SearchComponent {
  constructor(containerId) {
    this.containerId = containerId;
    this.searchInputId = `search-input`;
    this.clearButtonId = `clear-search`;
    this.formId = `search-contact-form`;
    this.resultsContainerId = `search-results`;
  }

  render() {
    const inputClass =
      "pl-12 pr-12 py-3 lg:py-2 bg-gray-200 rounded-lg lg:rounded-md w-full shadow-sm text-lg lg:text-sm focus:bg-white focus:outline-2 focus:outline-gray-300 transition-all";

    const currentSearchValue = this.getCurrentSearchValue();
    const showClearButton = this.shouldShowClearButton();

    return `
      <div class="relative w-full">
        <form id="${this.formId}" method="get" class="w-full relative">
          <i
            data-feather="search"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 lg:w-4 lg:h-4"
          ></i>
          <input
            type="text"
            name="q"
            placeholder="Search contact..."
            class="${inputClass}"
            id="${this.searchInputId}"
            value="${currentSearchValue}"
            autocomplete="off"
          />
          <!-- Clear Button -->
          <button
            type="button"
            id="${this.clearButtonId}"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors ${
              showClearButton ? "" : "hidden"
            }"
          >
            <i data-feather="x" class="w-5 h-5 lg:w-4 lg:h-4"></i>
          </button>
        </form>
        <div
          id="${this.resultsContainerId}"
          class="fixed bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto hidden"
        ></div>
      </div>
    `;
  }

  getCurrentSearchValue() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  }

  shouldShowClearButton() {
    return !!this.getCurrentSearchValue();
  }

  initialize() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error("Search container not found:", this.containerId);
      return;
    }

    container.innerHTML = this.render();
    this.setupEventListeners();
    feather.replace();

    // Initialize search popup
    const searchPopup = new SearchPopup(
      this.searchInputId,
      this.resultsContainerId
    );
    searchPopup.initialize();
  }

  setupEventListeners() {
    const searchInput = document.getElementById(this.searchInputId);
    const clearButton = document.getElementById(this.clearButtonId);
    const searchForm = document.getElementById(this.formId);

    if (!searchInput || !clearButton || !searchForm) {
      console.error("Search elements not found");
      return;
    }

    // Form submission
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleSearch();
    });

    clearButton.addEventListener("click", () => {
      this.clearSearch();
    });

    searchInput.addEventListener("input", () => {
      this.toggleClearButton(searchInput.value.length > 0);
    });

    this.toggleClearButton(this.shouldShowClearButton());
  }

  handleSearch() {
    const searchInput = document.getElementById(this.searchInputId);
    const keyword = searchInput.value.trim();

    const url = keyword ? `/?q=${encodeURIComponent(keyword)}` : "/";
    window.location.href = url;
  }

  clearSearch() {
    const searchInput = document.getElementById(this.searchInputId);
    searchInput.value = "";
    this.toggleClearButton(false);

    // Hide search results popup
    const resultsContainer = document.getElementById(this.resultsContainerId);
    if (resultsContainer) {
      resultsContainer.classList.add("hidden");
    }

    // Clear URL parameter if we're on search results page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("q")) {
      window.location.href = "/";
    }
  }

  toggleClearButton(show) {
    const clearButton = document.getElementById(this.clearButtonId);
    if (clearButton) {
      if (show) {
        clearButton.classList.remove("hidden");
      } else {
        clearButton.classList.add("hidden");
      }
    }
  }
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

function handleSearchResultClick(contactId) {
  window.location.href = `/detail/?id=${contactId}`;
}

function searchContacts(dataContacts, keyword) {
  const normalizedKeyword = keyword.toLowerCase();

  return dataContacts.filter((contact) => {
    const searchFields = [
      contact.fullName?.toLowerCase(),
      contact.email?.toLowerCase(),
      contact.phone?.toLowerCase(),
    ].filter(Boolean);

    return searchFields.some((field) => field.includes(normalizedKeyword));
  });
}

function goToDashboardPage() {
  window.location = "/";
}

function getInitials(name) {
  if (!name) return "NA";
  let words = name.trim().split(" ");
  let initials = "";
  for (let i = 0; i < words.length && initials.length < 2; i++) {
    if (words[i].length > 0) initials += words[i][0].toUpperCase();
  }
  return initials;
}

function getColorForInitial(initials) {
  let colors = [
    "bg-blue-500",
    "bg-blue-600",
    "bg-blue-700",
    "bg-green-500",
    "bg-green-600",
    "bg-green-700",
    "bg-red-500",
    "bg-red-600",
    "bg-red-700",
    "bg-yellow-500",
    "bg-yellow-600",
    "bg-yellow-700",
    "bg-purple-500",
    "bg-purple-600",
    "bg-purple-700",
    "bg-pink-500",
    "bg-pink-600",
    "bg-pink-700",
    "bg-teal-500",
    "bg-teal-600",
    "bg-teal-700",
    "bg-indigo-500",
    "bg-indigo-600",
    "bg-indigo-700",
    "bg-orange-500",
    "bg-orange-600",
    "bg-orange-700",
    "bg-cyan-500",
    "bg-cyan-600",
    "bg-cyan-700",
    "bg-emerald-500",
    "bg-emerald-600",
    "bg-emerald-700",
    "bg-violet-500",
    "bg-violet-600",
    "bg-violet-700",
    "bg-fuchsia-500",
    "bg-fuchsia-600",
    "bg-fuchsia-700",
    "bg-rose-500",
    "bg-rose-600",
    "bg-rose-700",
    "bg-amber-500",
    "bg-amber-600",
    "bg-amber-700",
    "bg-lime-500",
    "bg-lime-600",
    "bg-lime-700",
    "bg-sky-500",
    "bg-sky-600",
    "bg-sky-700",
  ];

  let index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

function getLabelColorClass(label) {
  const colorMap = {
    work: "bg-blue-100 text-blue-800",
    friend: "bg-green-100 text-green-800",
    family: "bg-purple-100 text-purple-800",
    client: "bg-orange-100 text-orange-800",
  };

  return colorMap[label.toLowerCase()] || "bg-gray-100 text-gray-800";
}

function formattedBirthdate(birthdate) {
  if (birthdate) {
    try {
      return new Date(birthdate).toLocaleString("en-US", {
        dateStyle: "long",
      });
    } catch (error) {
      return "Invalid Date";
    }
  }
  return "-";
}

function showNotification(message, type = "info") {
  const notificationContainer = document.getElementById(
    "notification-container"
  );
  const notification = document.createElement("div");

  notification.className = `mb-4 px-4 py-2 rounded text-white ${
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500"
  }`;
  notification.innerText = message;

  notificationContainer.appendChild(notification);

  setTimeout(() => {
    if (notificationContainer.contains(notification)) {
      notificationContainer.removeChild(notification);
    }
  }, 300);
}

function getContactDetailsById(dataContacts, id) {
  const contact = dataContacts.find((contact) => contact.id === id);
  return contact;
}

function addContact(dataContacts, newContactData) {
  const lastId =
    dataContacts.length > 0 ? dataContacts[dataContacts.length - 1].id : 0;
  const newId = lastId + 1;

  const newContact = {
    id: newId,
    fullName: newContactData.fullName ?? "Unknown",
    phone: newContactData.phone ?? null,
    email: newContactData.email ?? null,
    birthdate: newContactData.birthdate ?? null,
    address: newContactData.address ?? null,
    labels: Array.isArray(newContactData.labels) ? newContactData.labels : [],
    color:
      newContactData.color ||
      getColorForInitial(getInitials(newContactData.fullName)),
  };

  if (!newContact.phone && !newContact.email) {
    showNotification(
      "At least one contact method (phone or email) is required.",
      "error"
    );
    return dataContacts;
  }

  const isPhoneExisted = newContact.phone
    ? dataContacts.some((contact) => contact.phone === newContact.phone)
    : false;

  if (isPhoneExisted) {
    showNotification(
      `Contact with phone number ${newContact.phone} already exists.`,
      "error"
    );
    return dataContacts;
  }

  const updatedContacts = [...dataContacts, newContact];

  saveContactsToStorage(updatedContacts);
  showNotification(
    `Contact ${newContact.fullName} added successfully!`,
    "success"
  );
  setTimeout(() => {
    goToDashboardPage();
  }, 300);
}

function editContactById(dataContacts, id, updatedFields) {
  if (!updatedFields.phone && !updatedFields.email) {
    showNotification(
      "At least one contact method (phone or email) is required.",
      "error"
    );
    return dataContacts;
  }

  const updatedContacts = dataContacts.map((contact) => {
    if (contact.id === id) {
      return { ...contact, ...updatedFields };
    }
    return contact;
  });

  saveContactsToStorage(updatedContacts);
  showNotification("Contact updated succesfully", "success");
  setTimeout(() => {
    goToDashboardPage();
  }, 300);
}

// ====================================
// LABEL FILTER MANAGER
// ====================================

function initializeLabelFilters() {
  const applyButton = document.getElementById("apply-filters");
  const clearButton = document.getElementById("clear-filters");
  const checkboxes = document.querySelectorAll('input[name="label"]');

  // Update apply button state
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const anyChecked = Array.from(checkboxes).some(
        (checkbox) => checkbox.checked
      );
      applyButton.disabled = !anyChecked;
    });
  });

  // Apply filters
  applyButton.addEventListener("click", applyLabelFilters);

  // Clear filters
  clearButton.addEventListener("click", clearLabelFilters);
}

function applyLabelFilters() {
  const checkboxes = document.querySelectorAll('input[name="label"]:checked');
  const selectedLabels = Array.from(checkboxes).map(
    (checkbox) => checkbox.value
  );

  if (selectedLabels.length === 0) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get("q");

  // Format: ?labels=work,family
  const labelsString = selectedLabels.join(",");
  const newUrl = searchQuery
    ? `/?q=${searchQuery}&labels=${labelsString}`
    : `/?labels=${labelsString}`;

  window.location.href = newUrl;
}

function clearLabelFilters() {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get("q");

  const newUrl = searchQuery ? `/?q=${searchQuery}` : "/";
  window.location.href = newUrl;
}

function updateLabelFiltersUI(labelsParam) {
  const checkboxes = document.querySelectorAll('input[name="label"]');

  // Reset all checkboxes
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Check the boxes based on URL parameter
  if (labelsParam) {
    const selectedLabels = labelsParam.split(",");
    checkboxes.forEach((checkbox) => {
      if (selectedLabels.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });
  }

  // Update apply button state
  const applyButton = document.getElementById("apply-filters");
  const anyChecked = Array.from(checkboxes).some(
    (checkbox) => checkbox.checked
  );
  applyButton.disabled = !anyChecked;
}

function updateActiveFiltersDisplay(labelsParam) {
  const activeFiltersSection = document.getElementById(
    "active-filters-section"
  );
  const currentActiveFilters = document.getElementById(
    "current-active-filters"
  );

  if (!labelsParam) {
    activeFiltersSection.classList.add("hidden");
    currentActiveFilters.classList.add("hidden");
    return;
  }

  const selectedLabels = labelsParam.split(",");

  // Update desktop active filters
  currentActiveFilters.innerHTML = `
    <span class="text-sm text-gray-600 font-medium">Active Filters:</span>
    ${selectedLabels
      .map(
        (label) => `
      <span class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
        <i data-feather="tag" class="w-3 h-3"></i>
        ${label}
      </span>
    `
      )
      .join("")}
    <button 
      onclick="clearLabelFilters()" 
      class="text-sm text-gray-600 hover:text-gray-800 underline flex items-center gap-1"
    >
      <i data-feather="x" class="w-3 h-3"></i>
      Clear all
    </button>
  `;
  currentActiveFilters.classList.remove("hidden");

  feather.replace();
}

function filterContactsByMultipleLabels(contacts, labels) {
  return contacts.filter((contact) => {
    return labels.some(
      (label) =>
        contact.labels &&
        contact.labels.some(
          (contactLabel) => contactLabel.toLowerCase() === label.toLowerCase()
        )
    );
  });
}

// ====================================
// DELETE MANAGER
// ====================================

function deleteContactById(dataContacts, id) {
  try {
    const updatedContacts = dataContacts.filter((contact) => contact.id !== id);
    console.log("Contact deleted with id:", id);
    saveContactsToStorage(updatedContacts);
    return updatedContacts;
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return dataContacts;
  }
}

function showDeleteConfirmationModal(contactId) {
  currentDeleteId = contactId;
  const modal = document.getElementById("delete-confirm-modal");
  const backdrop = document.getElementById("modal-backdrop");

  if (!modal) return;

  modal.classList.remove("hidden");
  feather.replace();

  // Setup backdrop click
  if (backdrop) {
    backdrop.onclick = hideDeleteModal;
  }

  document.addEventListener("keydown", handleEscapeKey);
}

function handleConfirmDelete() {
  if (currentDeleteId !== null) {
    handleDeleteContact(currentDeleteId);
    hideDeleteModal();
  }
}

function hideDeleteModal() {
  const modal = document.getElementById("delete-confirm-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
  currentDeleteId = null;
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    hideDeleteModal();
  }
}

function handleDeleteContact(contactId) {
  const contacts = loadContactsFromStorage();

  try {
    const updatedContacts = deleteContactById(contacts, contactId);
    saveContactsToStorage(updatedContacts);
    showNotification("Contact deleted successfully", "success");
    setTimeout(() => {
      goToDashboardPage();
    }, 300);
  } catch (error) {
    showNotification("Failed to delete contact", "error");
  }
}

// ====================================
// MOBILE NAVIGATION
// ====================================

function initializeMobileNavigation() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const closeSidebarButton = document.getElementById("close-sidebar");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  if (!mobileMenuButton || !sidebar || !overlay) return;

  function openSidebar() {
    sidebar.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  mobileMenuButton.addEventListener("click", openSidebar);

  if (closeSidebarButton) {
    closeSidebarButton.addEventListener("click", closeSidebar);
  }

  overlay.addEventListener("click", closeSidebar);

  // Auto-close on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      closeSidebar();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initializeMobileNavigation();
});
