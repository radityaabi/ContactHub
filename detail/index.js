function renderContactById() {
  // Initialize search components
  const desktopSearch = new SearchComponent(
    "search-container-desktop",
    "desktop"
  );
  const mobileSearch = new SearchComponent("search-container-mobile", "mobile");
  desktopSearch.initialize();
  mobileSearch.initialize();

  setupMobileMenu();

  const dataContacts = loadContactsFromStorage();
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const id = Number(params.get("id"));
  const contact = getContactDetailsById(dataContacts, id);

  if (!contact) {
    showNotification("Contact not found", "error");
    setTimeout(() => {
      goToDashboardPage();
    }, 300);
    return;
  }

  const container = document.getElementById("contact-detail-container");

  const labels =
    contact.labels && contact.labels.length > 0
      ? contact.labels
          .map((label) => {
            const colorClass = getLabelColorClass(label);
            return `<span class="px-2 py-1 ${colorClass} text-xs rounded">${label}</span>`;
          })
          .join(" ")
      : '<span class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">No labels</span>';

  const initials = getInitials(contact.fullName);

  const contactDetails = `
    <div class="flex items-start gap-5 border-b border-gray-200 pb-5 mb-5">
      <div class="w-16 h-16 ${
        contact.color
      } rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
        ${initials}
      </div>
      <div class="flex-1">
        <h1 class="text-2xl font-bold break-words mb-2">${
          contact.fullName || "Unknown"
        }</h1>
        <div class="flex flex-wrap gap-1">
          ${labels}
        </div>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="space-y-4 mb-6">
      ${
        contact.phone
          ? `
        <div class="flex items-center group">
          <i data-feather="phone" class="text-gray-400 flex-shrink-0 mr-3"></i>
          <span class="text-gray-900 mr-1">${contact.phone}</span>
          <button 
            class="copy-btn p-1 text-gray-400 hover:text-blue-600" 
            data-copy="${contact.phone}"
            title="Copy phone number"
          >
            <i data-feather="copy" class="w-4 h-4"></i>
          </button>
        </div>
      `
          : ""
      }
      
      ${
        contact.email
          ? `
        <div class="flex items-center group">
          <i data-feather="mail" class="text-gray-400 flex-shrink-0 mr-3"></i>
          <a href="mailto:${contact.email}" target="_blank" class="text-blue-600 hover:text-blue-700 break-all mr-1">
            ${contact.email}
          </a>
          <button 
            class="copy-btn p-1 text-gray-400 hover:text-blue-600" 
            data-copy="${contact.email}"
            title="Copy email"
          >
            <i data-feather="copy" class="w-4 h-4"></i>
          </button>
        </div>
      `
          : ""
      }
      
      ${
        contact.address
          ? `
        <div class="flex group">
          <i data-feather="map-pin" class="text-gray-400 flex-shrink-0 mr-3 mt-1"></i>
          <span class="text-gray-900 break-words mr-1">${contact.address}</span>
          <button 
            class="copy-btn p-1 text-gray-400 hover:text-blue-600 flex-shrink-0 mt-1" 
            data-copy="${contact.address}"
            title="Copy address"
          >
            <i data-feather="copy" class="w-4 h-4"></i>
          </button>
        </div>
      `
          : ""
      }
      
      ${
        contact.birthdate
          ? `
        <div class="flex items-center gap-3">
          <i data-feather="calendar" class="text-gray-400 flex-shrink-0"></i>
          <span class="text-gray-900">${formattedBirthdate(
            contact.birthdate
          )}</span>
        </div>
      `
          : ""
      }
    </div>

    <div class="flex gap-3 pt-5 border-t border-gray-200">
      <button
        onclick="editContactPage(${contact.id})"
        class="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex-1 sm:flex-none group"
        title="Edit Contact"
      >
        <i data-feather="edit" class="w-4 h-4"></i>
        <span class="sm:inline hidden">Edit</span>
        <span class="sm:hidden inline">Edit</span>
      </button>
      
      <button
        class="delete-button flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex-1 sm:flex-none group"
        title="Delete Contact"
      >
        <i data-feather="trash-2" class="w-4 h-4"></i>
        <span class="sm:inline hidden">Delete</span>
        <span class="sm:hidden inline">Delete</span>
      </button>
      
      <a
        href="/"
        class="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors flex-1 sm:flex-none group text-center"
        title="Back to Contacts"
      >
        <i data-feather="arrow-left" class="w-4 h-4"></i>
        <span class="sm:inline hidden">Back</span>
        <span class="sm:hidden inline">Back</span>
      </a>
    </div>
  `;

  container.innerHTML = contactDetails;
  feather.replace();
  addDeleteEventListeners(contact);
  addCopyEventListeners();
}

function addCopyEventListeners() {
  document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      const textToCopy = this.getAttribute("data-copy");

      // Copy to clipboard
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          const originalIcon = this.innerHTML;
          this.innerHTML =
            '<i data-feather="check" class="w-4 h-4 text-green-500"></i>';
          feather.replace();

          showNotification("Copied to clipboard!", "success");

          // Revert back to copy icon
          setTimeout(() => {
            this.innerHTML = originalIcon;
            feather.replace();
          }, 300);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          showNotification("Failed to copy to clipboard", "error");
        });
    });
  });
}

function addDeleteEventListeners(contact) {
  const deleteButton = document.querySelector(".delete-button");
  if (!deleteButton) return;

  deleteButton.addEventListener("click", function (event) {
    event.stopPropagation();
    const confirmDelete = confirm(
      "Are you sure you want to delete this contact?"
    );
    if (confirmDelete) {
      const dataContacts = loadContactsFromStorage();
      deleteContactById(dataContacts, contact.id);
      showNotification("Contact deleted successfully", "success");

      setTimeout(function () {
        goToDashboardPage();
      }, 300);
    } else {
      showNotification("Contact deletion cancelled", "info");
    }
  });
}

function editContactPage(id) {
  window.location.href = `/edit-contact/?id=${id}`;
}

// Initial Render
document.addEventListener("DOMContentLoaded", renderContactById);
