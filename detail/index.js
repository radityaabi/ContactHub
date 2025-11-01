// Global variable to store the ID of the contact to be deleted
let currentDeleteId = null;

function renderContactById() {
  // Initialize search component
  const search = new SearchComponent("search-container");
  search.initialize();

  // Initialize mobile navigation
  initializeMobileNavigation();

  // Initialize label filters
  initializeLabelFilters();

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
            return `<span class="px-2 py-1 sm:px-3 sm:py-1 ${colorClass} text-xs sm:text-sm font-medium rounded-full">${label}</span>`;
          })
          .join(" ")
      : '<span class="px-2 py-1 sm:px-3 sm:py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm font-medium rounded-full">No labels</span>';

  const initials = getInitials(contact.fullName);

  const contactDetails = `
    <!-- Main Content Container -->
    <div class="max-w-4xl mx-auto">
      <div class="flex items-start gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <!-- Avatar -->
        <div class="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 ${
          contact.color
        } rounded-full flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold flex-shrink-0">
          ${initials}
        </div>
        
        <div class="flex-1">
          <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">${
            contact.fullName || "Unknown"
          }</h1>
          <div class="flex flex-wrap gap-1 sm:gap-2">
            ${labels}
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-200 my-4 sm:my-6 md:my-8"></div>

      <!-- Contact Information -->
      <div class="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-6 md:mb-8">
        ${
          contact.phone
            ? `
          <div class="flex items-center">
            <i data-feather="phone" class="text-gray-400 w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 mr-2 sm:mr-3 md:mr-4"></i>
            <span class="text-sm sm:text-base md:text-lg text-gray-900 font-medium mr-1 sm:mr-2">${contact.phone}</span>
            <button 
              class="copy-button p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex-shrink-0" 
              data-copy="${contact.phone}"
              title="Copy phone number"
            >
              <i data-feather="copy" class="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4"></i>
            </button>
          </div>
        `
            : ""
        }
        
        ${
          contact.email
            ? `
          <div class="flex items-center">
            <i data-feather="mail" class="text-gray-400 w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 mr-2 sm:mr-3 md:mr-4"></i>
            <a href="mailto:${contact.email}" target="_blank" class="text-sm sm:text-base md:text-lg text-blue-600 hover:text-blue-700 font-medium break-all mr-1 sm:mr-2">
              ${contact.email}
            </a>
            <button 
              class="copy-button p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex-shrink-0" 
              data-copy="${contact.email}"
              title="Copy email"
            >
              <i data-feather="copy" class="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4"></i>
            </button>
          </div>
        `
            : ""
        }
        
        ${
          contact.address
            ? `
          <div class="flex items-start">
            <i data-feather="map-pin" class="text-gray-400 w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 mr-2 sm:mr-3 md:mr-4 mt-0.5"></i>
            <span class="text-sm sm:text-base md:text-lg text-gray-900 leading-relaxed mr-1 sm:mr-2">${contact.address}</span>
            <button 
              class="copy-button p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex-shrink-0 mt-0.5" 
              data-copy="${contact.address}"
              title="Copy address"
            >
              <i data-feather="copy" class="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4"></i>
            </button>
          </div>
        `
            : ""
        }
        
        ${
          contact.birthdate
            ? `
          <div class="flex items-center">
            <i data-feather="calendar" class="text-gray-400 w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 mr-2 sm:mr-3 md:mr-4"></i>
            <span class="text-sm sm:text-base md:text-lg text-gray-900 mr-1 sm:mr-2">${formattedBirthdate(
              contact.birthdate
            )}</span>
            <button 
              class="copy-button p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex-shrink-0" 
              data-copy="${formattedBirthdate(contact.birthdate)}"
              title="Copy birthdate"
            >
              <i data-feather="copy" class="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4"></i>
            </button>
          </div>
        `
            : ""
        }
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 pt-4 sm:pt-6 md:pt-8 border-t border-gray-200">
        <a
          href="/"
          class="flex items-center justify-center gap-1 sm:gap-2 bg-gray-200 text-gray-800 px-2 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 rounded-lg hover:bg-gray-300 transition-colors text-center font-medium text-xs sm:text-sm md:text-base"
        >
          <i data-feather="arrow-left" class="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4"></i>
          <span>Back</span>
        </a>
        
        <button
          onclick="editContactPage(${contact.id})"
          class="flex items-center justify-center gap-1 sm:gap-2 bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm md:text-base"
        >
          <i data-feather="edit" class="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4"></i>
          <span>Edit</span>
        </button>
        
        <button
          onclick="showDeleteConfirmationModal(${contact.id})"
          class="flex items-center justify-center gap-1 sm:gap-2 bg-red-600 text-white px-2 sm:px-3 md:px-4 py-2 sm:py-2 md:py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-xs sm:text-sm md:text-base focus:outline-none focus:ring-0"
        >
          <i data-feather="trash-2" class="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4"></i>
          <span>Delete</span>
        </button>
      </div>
    </div>
  `;

  container.innerHTML = contactDetails;
  feather.replace();

  addCopyEventListeners();

  // Update label filters UI based on URL parameters
  const labelsParam = new URLSearchParams(window.location.search).get("labels");
  updateLabelFiltersUI(labelsParam);
  updateActiveFiltersDisplay(labelsParam);
}

function addCopyEventListeners() {
  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      const textToCopy = this.getAttribute("data-copy");

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          const originalIcon = this.innerHTML;
          this.innerHTML =
            '<i data-feather="check" class="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 text-green-500"></i>';
          feather.replace();

          showNotification("Copied to clipboard!", "success");

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

function editContactPage(id) {
  window.location.href = `/edit-contact/?id=${id}`;
}

// Show delete confirmation modal
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

// Initial Render
document.addEventListener("DOMContentLoaded", function () {
  renderContactById();
});
