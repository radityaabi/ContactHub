function renderContactById() {
  const dataContacts = loadContactsFromStorage();
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const id = Number(params.get("id"));
  const contact = getContactDetailsById(dataContacts, id);

  if (!contact) {
    showNotification("Contact not found", "error");
    setTimeout(() => {
      goToHomePage();
    }, 2000);
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
    <div class="flex items-center gap-5 border-b pb-5 mb-5">
      ${(function () {
        var initials = getInitials(contact.fullName);
        var bgColor = getColorForInitial(initials);
        return (
          '<div class="w-16 h-16 ' +
          bgColor +
          ' rounded-full flex items-center justify-center text-white text-2xl font-bold">' +
          initials +
          "</div>"
        );
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
        <div class="flex items-center gap-3">
          <i data-feather="phone" class="text-blue-700"></i>
          <span>${contact.phone}</span>
        </div>
      `
          : ""
      }
      
      ${
        contact.email
          ? `
        <div class="flex items-center gap-3">
          <i data-feather="mail" class="text-blue-700"></i>
          <a href="mailto:${contact.email}" target="_blank">
            <span class="text-blue-600 hover:text-blue-700">${contact.email}</span>
          </a>
        </div>
      `
          : ""
      }
      
      ${
        contact.address
          ? `
        <div class="flex items-center gap-3">
          <i data-feather="map-pin" class="text-blue-700"></i>
          <span>${contact.address}</span>
        </div>
      `
          : ""
      }
      
      ${
        contact.birthdate
          ? `
        <div class="flex items-center gap-3">
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
        onclick="editContact(${contact.id})"
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 edit-button"
      >
        <i data-feather="edit"></i> Edit
      </button>
      <button
        class="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 delete-button"
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
      }, 1500);
    } else {
      showNotification("Contact deletion cancelled", "info");
    }
  });
}

function editContact(id) {
  window.location.href = `/edit-contact/?id=${id}`;
}

document.addEventListener("DOMContentLoaded", renderContactById);
