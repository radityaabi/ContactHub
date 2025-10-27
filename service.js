class SearchPopup {
  constructor(searchInputId, resultsContainerId, type = "desktop") {
    this.searchInputId = searchInputId;
    this.resultsContainerId = resultsContainerId;
    this.type = type;
    this.searchTimeout = null;
    this.debounceDelay = 200;
    this.isOpen = false;
  }

  initialize() {
    const searchInput = document.getElementById(this.searchInputId);
    const resultsContainer = document.getElementById(this.resultsContainerId);

    if (!searchInput || !resultsContainer) return;

    searchInput.addEventListener("input", (event) => {
      this.handleSearchInput(event.target.value);
    });

    searchInput.addEventListener("focus", () => {
      const currentValue = searchInput.value.trim();
      if (currentValue) {
        this.showResults(currentValue);
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
      }
    });
  }

  handleSearchInput(keyword) {
    // Clear previous timeout
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
    const filteredContacts = this.searchContacts(contacts, keyword);
    this.renderResults(filteredContacts, keyword);
    this.isOpen = true;
  }

  hideResults() {
    const resultsContainer = document.getElementById(this.resultsContainerId);
    resultsContainer.classList.add("hidden");
    this.isOpen = false;
  }

  searchContacts(contacts, keyword) {
    const normalizedKeyword = keyword.toLowerCase();

    return contacts
      .filter((contact) => {
        const searchFields = [
          contact.fullName?.toLowerCase(),
          contact.email?.toLowerCase(),
        ].filter(Boolean);

        return searchFields.some((field) => field.includes(normalizedKeyword));
      })
      .slice(0, 8); // Limit to 8 results
  }

  renderResults(contacts, keyword) {
    const resultsContainer = document.getElementById(this.resultsContainerId);

    if (contacts.length === 0) {
      resultsContainer.innerHTML = `
        <div class="p-4 text-center text-gray-500">
          <i data-feather="search" class="w-8 h-8 mx-auto mb-2 text-gray-300"></i>
          <p>No contacts found for "${keyword}"</p>
        </div>
      `;
    } else {
      resultsContainer.innerHTML = contacts
        .map(
          (contact) => `
        <div 
          class="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
          onclick="handleSearchResultClick(${contact.id})"
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

class SearchComponent {
  constructor(containerId, type = "desktop") {
    this.containerId = containerId;
    this.type = type;
    this.searchInputId = `search-input-${type}`;
    this.clearButtonId = `clear-search-${type}`;
    this.formId = `search-contact-form-${type}`;
  }

  render() {
    const isDesktop = this.type === "desktop";
    const inputClass = isDesktop
      ? "pl-12 pr-12 py-3 bg-gray-200 rounded-lg w-full shadow-sm text-lg focus:bg-white focus:border-1 focus:border-gray-300 focus:outline-none transition-colors"
      : "pl-10 pr-10 py-2 bg-gray-200 rounded-md w-full shadow-sm text-sm focus:bg-white focus:border-1 focus:border-gray-300 focus:outline-none transition-colors";

    const iconSize = isDesktop ? "w-5 h-5" : "w-4 h-4";
    const iconPosition = isDesktop ? "left-4" : "left-3";
    const clearButtonPosition = isDesktop ? "right-4" : "right-3";

    const currentSearchValue = this.getCurrentSearchValue();
    const showClearButton = this.shouldShowClearButton();

    return `
      <form id="${this.formId}" method="get" class="w-full relative">
        <i
          data-feather="search"
          class="absolute ${iconPosition} top-1/2 transform -translate-y-1/2 text-gray-500 ${iconSize}"
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
          class="absolute ${clearButtonPosition} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors ${
      showClearButton ? "" : "hidden"
    }"
        >
          <i data-feather="x" class="${iconSize}"></i>
        </button>
      </form>
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
    if (!container) return;

    container.innerHTML = this.render();
    this.setupEventListeners();
    feather.replace();

    initializeSearchPopup(this.type);
  }

  setupEventListeners() {
    const searchInput = document.getElementById(this.searchInputId);
    const clearButton = document.getElementById(this.clearButtonId);
    const searchForm = document.getElementById(this.formId);

    if (!searchInput || !clearButton || !searchForm) return;

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
    const resultsContainerId =
      this.type === "desktop"
        ? "search-results-desktop"
        : "search-results-mobile";
    const resultsContainer = document.getElementById(resultsContainerId);
    if (resultsContainer) {
      resultsContainer.classList.add("hidden");
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

function handleSearchResultClick(contactId) {
  window.location.href = `/detail/?id=${contactId}`;
}

function initializeSearchPopup(type = "desktop") {
  const searchInputId =
    type === "desktop" ? "search-input-desktop" : "search-input-mobile";
  const resultsContainerId =
    type === "desktop" ? "search-results-desktop" : "search-results-mobile";

  const searchPopup = new SearchPopup(searchInputId, resultsContainerId, type);
  searchPopup.initialize();
  return searchPopup;
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
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-fuchsia-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-sky-500",
    "bg-stone-500",
    "bg-slate-500",
    "bg-zinc-500",
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
    notificationContainer.removeChild(notification);
  }, 500);
}

function getContactDetailsById(dataContacts, id) {
  const contact = dataContacts.find((contact) => contact.id === id);
  return contact;
}

function searchContacts(dataContacts, keyword) {
  const normalizedKeyword = keyword.toLowerCase();

  return dataContacts.filter((contact) => {
    const searchFields = [
      contact.fullName?.toLowerCase(),
      contact.email?.toLowerCase(),
    ].filter(Boolean);

    return searchFields.some((field) => field.includes(normalizedKeyword));
  });
}

function filterContactsByLabel(contacts, label) {
  const filteredContactsByLabel = contacts.filter((contact) => {
    return (
      contact.labels &&
      contact.labels.some(
        (currentLabel) => currentLabel.toLowerCase() === label.toLowerCase()
      )
    );
  });

  return filteredContactsByLabel;
}

function addContact(dataContacts, newContactData) {
  const lastId = dataContacts[dataContacts.length - 1].id ?? 0;
  const newId = lastId + 1;

  const newContact = {
    id: newId,
    fullName: newContactData.fullName ?? "Unknown",
    phone: newContactData.phone ?? null,
    email: newContactData.email ?? null,
    birthdate: newContactData.birthdate ?? null,
    address: newContactData.address ?? null,
    labels: Array.isArray(newContactData.labels) ? newContactData.labels : [],
    color: newContactData.color,
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

function deleteContactById(dataContacts, id) {
  try {
    const updatedContacts = dataContacts.filter((contact) => contact.id !== id);
    console.log("Contact deleted with id:", id);
    saveContactsToStorage(updatedContacts);
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return dataContacts;
  }
}

function showDeleteConfirmationModal(contactId) {
  const modal = document.getElementById("delete-confirm-modal");
  const confirmButton = document.getElementById("confirm-delete-button");
  const cancelButton = document.getElementById("cancel-delete-button");
  const backdrop = document.getElementById("modal-backdrop");

  // Show modal
  modal.classList.remove("hidden");

  // Refresh feather icons
  feather.replace();

  // Remove any existing event listeners
  const newConfirmButton = confirmButton.cloneNode(true);
  const newCancelButton = cancelButton.cloneNode(true);

  confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
  cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);

  // Add event listeners to new buttons
  newConfirmButton.addEventListener("click", () => {
    handleDeleteContact(contactId);
    hideDeleteModal();
  });

  newCancelButton.addEventListener("click", () => {
    hideDeleteModal();
  });

  // Close modal when clicking backdrop
  backdrop.addEventListener("click", () => {
    hideDeleteModal();
  });
}

function hideDeleteModal() {
  const modal = document.getElementById("delete-confirm-modal");
  modal.classList.add("hidden");
}

function handleDeleteContact(contactId) {
  const contacts = loadContactsFromStorage();

  try {
    deleteContactById(contacts, contactId);
    showNotification("Contact deleted successfully", "success");
    setTimeout(() => {
      goToDashboardPage();
    }, 300);
  } catch (error) {
    showNotification(error.message, "error");
  }
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

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      closeSidebar();
    }
  });
}

function setupMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const closeSidebarButton = document.getElementById("close-sidebar");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

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

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", openSidebar);
  }

  if (closeSidebarButton) {
    closeSidebarButton.addEventListener("click", closeSidebar);
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  // Close sidebar when clicking on nav links (mobile)
  const sidebarLinks = sidebar.querySelectorAll("a");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  // Close sidebar on escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();
    }
  });

  // Close sidebar when window is resized to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      closeSidebar();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initializeMobileNavigation();
});
