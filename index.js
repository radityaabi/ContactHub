// Contacts Data
const initialContacts = [
  {
    id: 1,
    fullName: "John Doe",
    phone: "1234567890",
    email: "johndoe@gmail.com",
    birthdate: new Date("1990-01-01"),
    address: "123 Main St, Anytown, USA",
    labels: ["friend", "work"],
    color: "bg-blue-500",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    phone: "9876543210",
    email: "janesmith@gmail.com",
    birthdate: new Date("1985-05-15"),
    address: "456 Oak St, Sometown, USA",
    labels: ["family"],
    color: "bg-green-500",
  },
  {
    id: 3,
    fullName: "Alice Johnson",
    phone: "5551234567",
    email: "alicejohnson@gmail.com",
    birthdate: new Date("1992-09-30"),
    address: "789 Pine St, Othertown, USA",
    labels: ["work"],
    color: "bg-red-500",
  },
];

const setInitialContacts = () => {
  const contacts = loadContactsFromStorage();

  if (contacts.length === 0) {
    saveContactsToStorage(initialContacts);
  }
};

const renderContacts = () => {
  setInitialContacts();
  const contacts = loadContactsFromStorage();

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const keyword = params.get("q");
  const labelFilter = params.get("tag");

  const contactsTableBody = document.getElementById("contacts-table");

  contactsTableBody.innerHTML = "";

  let contactsToRender = keyword
    ? searchContacts(contacts, keyword)
    : labelFilter
    ? filterContactsByLabel(contacts, labelFilter)
    : contacts;

  contactsToRender.sort((a, b) => {
    const nameA = a.fullName.toLowerCase();
    const nameB = b.fullName.toLowerCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  if (contactsToRender.length === 0) {
    const noResultsRow = `
      <tr>
        <td colspan="6" class="px-4 py-8 text-center text-gray-500">
          No contacts found
        </td>
      </tr>
    `;
    contactsTableBody.innerHTML = noResultsRow;
    return;
  }

  contactsToRender.forEach((contact) => {
    const labelsString = contact.labels.length
      ? contact.labels
          .map((label) => {
            const colorClass = getLabelColorClass(label);
            return `<span class="px-2 py-1 ${colorClass} text-xs rounded">${label}</span>`;
          })
          .join(" ")
      : "-";

    const initials = getInitials(contact.fullName);

    const contactRow = `
      <tr class="border-t border-gray-200 hover:bg-gray-50">
        <td class="px-4 py-2 flex items-center gap-3">
          <div class="w-10 h-10 ${
            contact.color
          } rounded-full flex items-center justify-center text-white font-bold">
            ${initials}
          </div>
          <span>${contact.fullName}</span>
        </td>
        <td class="px-4 py-2">${contact.phone ?? "-"}</td>
        <td class="px-4 py-2">${contact.email ?? "-"}</td>
        <td class="px-4 py-2">${formattedBirthdate(contact.birthdate)}</td>
        <td class="px-4 py-2">
          ${labelsString}
        </td>
        
        <td class="px-4 py-2 text-center space-x-3">
          <button
            onclick="detailContactPage(${contact.id})"
            class="text-blue-600 hover:text-blue-800 transition-colors view-button"
            title="View"
          >
            <i data-feather="eye"></i>
          </button>
          <button 
            onclick="editContactPage(${contact.id})"
            class="text-green-600 hover:text-green-800 transition-colors edit-button" 
            title="Edit"
          >
            <i data-feather="edit-2"></i>
          </button>
          <button
            class="text-red-600 hover:text-red-800 transition-colors delete-button"
            title="Delete"
            data-id="${contact.id}"
          >
            <i data-feather="trash-2"></i>
          </button>
        </td>
      </tr>
    `;

    contactsTableBody.innerHTML += contactRow;
  });

  addDeleteEventListeners();
};

function editContactPage(id) {
  window.location.href = `/edit-contact/?id=${id}`;
}

function detailContactPage(id) {
  window.location.href = `/detail/?id=${id}`;
}

function addDeleteEventListeners() {
  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const contactId = parseInt(event.currentTarget.getAttribute("data-id"));
      const contacts = loadContactsFromStorage();

      try {
        if (confirm("Are you sure you want to delete this contact?")) {
          deleteContactById(contacts, contactId);
          showNotification("Contact deleted successfully", "success");
          setTimeout(() => {
            goToDashboardPage();
          }, 300);
        } else {
          showNotification("Contact deletion cancelled", "info");
        }
      } catch (error) {
        showNotification(error.message, "error");
      }
    });
  });
}

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
  renderContacts();
  feather.replace();
});
