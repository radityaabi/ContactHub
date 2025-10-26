function renderContactById() {
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
            return `<span class="${colorClass} text-xs px-3 py-1 rounded-full">${label}</span>`;
          })
          .join("")
      : '<span class="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">No labels</span>';

  const contactDetails = `
    <div class="flex items-center gap-5 border-b border-gray-300 pb-5 mb-5">
      ${(function () {
        const initials = getInitials(contact.fullName);
        return `<div class="w-16 h-16 ${contact.color} rounded-full flex items-center justify-center text-white text-2xl font-bold"> ${initials} </div>`;
      })()}
      <div>
        <h1 class="text-2xl font-bold">${contact.fullName || "Unknown"}</h1>
        <div class="flex gap-2 mt-2">
          ${labels}
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="space-y-4">
      ${
        contact.phone
          ? `
        <div class="flex items-center gap-1">
          <i data-feather="phone" class="text-blue-700 flex-shrink-0"></i>
          <span>${contact.phone}</span>
          <button 
            onclick="copyToClipboard('${contact.phone}', 'phone')" 
            class="copy-btn opacity-70 hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm px-2 py-1 rounded hover:bg-blue-50 ml-1"
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
        <div class="flex items-center gap-1">
          <i data-feather="mail" class="text-blue-700 flex-shrink-0"></i>
          <a href="mailto:${contact.email}" target="_blank" class="hover:underline">
            <span class="text-blue-600 hover:text-blue-700">${contact.email}</span>
          </a>
          <button 
            onclick="copyToClipboard('${contact.email}', 'email')" 
            class="copy-btn opacity-70 hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm px-2 py-1 rounded hover:bg-blue-50 ml-1"
            title="Copy email address"
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
        <div class="flex items-center gap-1">
          <i data-feather="map-pin" class="text-blue-700 flex-shrink-0"></i>
          <span>${contact.address}</span>
          <button 
            onclick="copyToClipboard('${contact.address}', 'address')" 
            class="copy-btn opacity-70 hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm px-2 py-1 rounded hover:bg-blue-50 ml-1"
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
        <div class="flex items-center gap-1">
          <i data-feather="calendar" class="text-blue-700"></i>
          <span>${formattedBirthdate(contact.birthdate)}</span>
        </div>
      `
          : ""
      }
    </div>

    <!-- Actions -->
    <div class="flex gap-4 mt-8">
      <button
        onclick="editContactPage(${contact.id})"
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer edit-button"
      >
        <i data-feather="edit"></i> Edit
      </button>
      <button
        class="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer delete-button"
      >
        <i data-feather="trash-2"></i> Delete
      </button>
      <a
        href="/"
        class="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
      >
        <i data-feather="arrow-left"></i> Back
      </a>
    </div>
  `;

  container.innerHTML = contactDetails;
  feather.replace();
  addDeleteEventListeners(contact);
}

function addDeleteEventListeners(contact) {
  const deleteButton = document.querySelector(".delete-button");
  if (!deleteButton) return;

  deleteButton.addEventListener("click", function () {
    const confirmDelete = confirm(
      "Are you sure you want to delete this contact?"
    );
    if (confirmDelete) {
      const dataContacts = loadContactsFromStorage();
      deleteContactById(dataContacts, contact.id);
      showNotification("Contact deleted successfully", "success");

      setTimeout(function () {
        window.location.href = "/";
      }, 300);
    } else {
      showNotification("Contact deletion cancelled", "info");
    }
  });
}

function editContactPage(id) {
  window.location.href = `/edit-contact/?id=${id}`;
}

function copyToClipboard(text, type) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      let message = "";
      switch (type) {
        case "phone":
          message = "Phone number copied to clipboard!";
          break;
        case "email":
          message = "Email address copied to clipboard!";
          break;
        case "address":
          message = "Address copied to clipboard!";
          break;
        default:
          message = "Copied to clipboard!";
      }
      showNotification(message, "success");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      showNotification("Failed to copy to clipboard", "error");
    });
}

document.addEventListener("DOMContentLoaded", renderContactById);
