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
  },
  {
    id: 2,
    fullName: "Jane Smith",
    phone: "9876543210",
    email: "janesmith@gmail.com",
    birthdate: new Date("1985-05-15"),
    address: "456 Oak St, Sometown, USA",
    labels: ["family"],
  },
  {
    id: 3,
    fullName: "Alice Johnson",
    phone: "5551234567",
    email: "alicejohnson@gmail.com",
    birthdate: new Date("1992-09-30"),
    address: "789 Pine St, Othertown, USA",
    labels: ["work"],
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

  let contactsToRender = [];

  if (keyword) {
    contactsToRender = searchContacts(contacts, keyword);
  } else if (labelFilter) {
    console.log(labelFilter);
    contactsToRender = filterContactsByLabel(contacts, labelFilter);
  } else {
    contactsToRender = contacts;
  }

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
            return `<span class="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">${label}</span>`;
          })
          .join(" ")
      : "-";

    let formattedBirthdate = "-";
    if (contact.birthdate) {
      try {
        formattedBirthdate = new Date(contact.birthdate).toLocaleString(
          "en-US",
          {
            dateStyle: "long",
          }
        );
      } catch (error) {
        console.warn("Invalid birthdate for contact:", contact.fullName);
        formattedBirthdate = "Invalid Date";
      }
    }

    const contactRow = `
      <tr class="border-t hover:bg-gray-50">
        <td class="px-4 py-2">${contact.fullName}</td>
        <td class="px-4 py-2">${contact.phone ?? "-"}</td>
        <td class="px-4 py-2">${contact.email ?? "-"}</td>
        <td class="px-4 py-2">${formattedBirthdate}</td>
        <td class="px-4 py-2">
          ${labelsString}
        </td>
        
        <td class="px-4 py-2 text-center space-x-3">
          <a href="/detail/?id=${contact.id}">  
            <button
                class="text-blue-600 hover:text-blue-800 transition-colors view-btn"
                title="View"
              >
              <i data-feather="eye"></i>
            </button>
          </a>
          <a href="/edit-contact/?id=${contact.id}">  
            <button class="text-green-600 hover:text-green-800 transition-colors edit-btn" title="Edit">
              <i data-feather="edit-2"></i>
            </button>
          </a>
          <button
            class="text-red-600 hover:text-red-800 transition-colors delete-btn"
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

const addDeleteEventListeners = () => {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const contactId = parseInt(event.currentTarget.getAttribute("data-id"));
      const contacts = loadContactsFromStorage();

      try {
        if (confirm("Are you sure you want to delete this contact?")) {
          deleteContactById(contacts, contactId);
          showNotification("Contact deleted successfully", "success");
          renderContacts();
          feather.replace();
        } else {
          showNotification("Contact deletion cancelled", "info");
        }
      } catch (error) {
        showNotification(error.message, "error");
      }
    });
  });
};

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
  renderContacts();
  feather.replace();
});
