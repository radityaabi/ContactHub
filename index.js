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
  {
    id: 4,
    fullName: "Mama Radit",
    phone: "08923194194",
    email: "",
    birthdate: new Date("1969-08-10"),
    address: "",
    labels: ["client", "family", "friend", "work"],
    color: "bg-purple-500",
  },
  {
    id: 5,
    fullName: "Raditya Abiansyah",
    phone: "",
    email: "",
    birthdate: null,
    address: "",
    labels: [],
    color: "bg-yellow-500",
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

  const desktopSearch = new SearchComponent(
    "search-container-desktop",
    "desktop"
  );
  const mobileSearch = new SearchComponent("search-container-mobile", "mobile");

  desktopSearch.initialize();
  mobileSearch.initialize();

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const keyword = params.get("q");
  const labelFilter = params.get("tag");

  const contactsTableBody = document.getElementById("contacts-table");
  const contactsMobileContainer = document.getElementById("contacts-mobile");

  contactsTableBody.innerHTML = "";
  if (contactsMobileContainer) {
    contactsMobileContainer.innerHTML = "";
  }

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

    if (contactsMobileContainer) {
      contactsMobileContainer.innerHTML = `
        <div class="text-center text-gray-500 py-8">
          ${
            keyword ? `No contacts found for "${keyword}"` : "No contacts found"
          }
        </div>
      `;
    }
    return;
  }

  // Render desktop table
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
      <tr class="border-t border-gray-200 hover:bg-gray-100 cursor-pointer" onclick="detailContactPage(${
        contact.id
      })">
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
            class="text-red-600 hover:text-red-800 transition-colors delete-button cursor-pointer"
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

  // Render mobile cards
  if (contactsMobileContainer) {
    contactsToRender.forEach((contact) => {
      const labelsString = contact.labels.length
        ? contact.labels
            .map((label) => {
              const colorClass = getLabelColorClass(label);
              return `<span class="px-2 py-1 ${colorClass} text-xs rounded">${label}</span>`;
            })
            .join(" ")
        : "";

      const initials = getInitials(contact.fullName);

      const contactCard = `
        <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer mb-4" onclick="detailContactPage(${
          contact.id
        })">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 ${
              contact.color
            } rounded-full flex items-center justify-center text-white font-bold text-lg">
              ${initials}
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-lg">${contact.fullName}</h3>
              <div class="flex flex-wrap gap-1 mt-1">
                ${labelsString}
              </div>
            </div>
            <button
              class="text-red-600 hover:text-red-800 transition-colors delete-button p-2"
              title="Delete"
              data-id="${contact.id}"
              onclick="event.stopPropagation()"
            >
              <i data-feather="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          
          <!-- Contact Info -->
          <div class="space-y-2 text-sm text-gray-600 ml-15">
            ${
              contact.phone
                ? `
              <div class="flex items-center gap-2">
                <i data-feather="phone" class="w-4 h-4 text-gray-400"></i>
                <span>${contact.phone}</span>
              </div>
            `
                : ""
            }
            ${
              contact.email
                ? `
              <div class="flex items-center gap-2">
                <i data-feather="mail" class="w-4 h-4 text-gray-400"></i>
                <span>${contact.email}</span>
              </div>
            `
                : ""
            }
            ${
              contact.birthdate
                ? `
              <div class="flex items-center gap-2">
                <i data-feather="calendar" class="w-4 h-4 text-gray-400"></i>
                <span>${formattedBirthdate(contact.birthdate)}</span>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `;

      contactsMobileContainer.innerHTML += contactCard;
    });
  }

  addDeleteEventListeners();
  setupMobileMenu();
  feather.replace();
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
      event.stopPropagation();
      const contactId = parseInt(event.currentTarget.getAttribute("data-id"));
      showDeleteConfirmationModal(contactId);
    });
  });
}

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
  renderContacts();
});
