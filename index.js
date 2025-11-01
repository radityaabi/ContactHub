const initialContacts = [
  {
    id: 1,
    fullName: "Ahmad Fauzi",
    phone: "081234567890",
    email: "ahmad.fauzi@gmail.com",
    birthdate: new Date("1988-03-15"),
    address: "Jl. Teuku Umar No. 45, Banda Aceh, Aceh",
    labels: ["friend", "work"],
    color: "bg-blue-500",
  },
  {
    id: 2,
    fullName: "Siti Rahayu",
    phone: "082345678901",
    email: "siti.rahayu@yahoo.com",
    birthdate: new Date("1992-07-22"),
    address: "Jl. Sisingamangaraja No. 23, Medan, Sumatera Utara",
    labels: ["family"],
    color: "bg-green-500",
  },
  {
    id: 3,
    fullName: "Budi Setiawan",
    phone: "083456789012",
    email: "budi.setiawan@gmail.com",
    birthdate: new Date("1985-11-08"),
    address: "Jl. Sudirman No. 78, Palembang, Sumatera Selatan",
    labels: ["work", "client"],
    color: "bg-red-500",
  },
  {
    id: 4,
    fullName: "Maya Sari",
    phone: "084567890123",
    email: "maya.sari@outlook.com",
    birthdate: new Date("1990-05-30"),
    address: "Jl. Braga No. 56, Bandung, Jawa Barat",
    labels: ["friend"],
    color: "bg-purple-500",
  },
  {
    id: 5,
    fullName: "Joko Widodo",
    phone: "085678901234",
    email: "joko.widodo@gmail.com",
    birthdate: new Date("1995-12-10"),
    address: "Jl. Malioboro No. 34, Yogyakarta, DI Yogyakarta",
    labels: ["work"],
    color: "bg-yellow-500",
  },
  {
    id: 6,
    fullName: "Dewi Lestari",
    phone: "086789012345",
    email: "dewi.lestari@yahoo.com",
    birthdate: new Date("1987-09-18"),
    address: "Jl. Raya Kuta No. 89, Badung, Bali",
    labels: ["family", "friend"],
    color: "bg-pink-500",
  },
  {
    id: 7,
    fullName: "Andi Pratama",
    phone: "087890123456",
    email: "andi.pratama@gmail.com",
    birthdate: new Date("1983-02-25"),
    address: "Jl. Urip Sumoharjo No. 67, Makassar, Sulawesi Selatan",
    labels: ["client", "work"],
    color: "bg-indigo-500",
  },
  {
    id: 8,
    fullName: "Maria Magdalena",
    phone: "088901234567",
    email: "maria.magdalena@outlook.com",
    birthdate: new Date("1993-08-12"),
    address: "Jl. Flores No. 23, Kupang, Nusa Tenggara Timur",
    labels: ["friend"],
    color: "bg-teal-500",
  },
  {
    id: 9,
    fullName: "Benyamin Soumokil",
    phone: "089012345678",
    email: "benyamin.soumokil@gmail.com",
    birthdate: new Date("1991-04-05"),
    address: "Jl. Pattimura No. 12, Ambon, Maluku",
    labels: ["work", "client"],
    color: "bg-orange-500",
  },
  {
    id: 10,
    fullName: "Martha Tilaar",
    phone: "089123456789",
    email: "martha.tilaar@yahoo.com",
    birthdate: new Date("1989-06-20"),
    address: "Jl. Merauke No. 45, Merauke, Papua Selatan",
    labels: ["family"],
    color: "bg-cyan-500",
  },
];

function setInitialContacts() {
  const contacts = loadContactsFromStorage();

  if (contacts.length === 0) {
    saveContactsToStorage(initialContacts);
  }
}

function renderContacts() {
  setInitialContacts();
  const contacts = loadContactsFromStorage();

  // Initialize search component
  const search = new SearchComponent("search-container");
  search.initialize();

  // Initialize label filters
  initializeLabelFilters();

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const keyword = params.get("q");
  const labelsParam = params.get("labels");

  const contactsContainer = document.getElementById("contacts-container");
  const contactQuantityElements =
    document.querySelectorAll(".contact-quantity");

  contactsContainer.innerHTML = "";

  let contactsToRender = keyword ? searchContacts(contacts, keyword) : contacts;

  // Apply label filters
  if (labelsParam) {
    const selectedLabels = labelsParam.split(",");
    contactsToRender = filterContactsByMultipleLabels(
      contactsToRender,
      selectedLabels
    );
  }

  contactQuantityElements.forEach((element) => {
    updateContactQuantity(
      element,
      contactsToRender.length,
      contacts.length,
      keyword,
      labelsParam
    );
  });

  // Update UI based on current filters
  updateLabelFiltersUI(labelsParam);
  updateActiveFiltersDisplay(labelsParam);

  contactsToRender.sort((a, b) => {
    const nameA = a.fullName.toLowerCase();
    const nameB = b.fullName.toLowerCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  if (contactsToRender.length === 0) {
    contactsContainer.innerHTML = `
      <tr>
        <td colspan="6" class="px-4 py-8 text-center text-gray-500">
          <div class="flex flex-col items-center justify-center py-8">
            <i data-feather="search" class="w-12 h-12 text-gray-300 mb-4"></i>
            <p class="text-lg text-gray-500">${
              keyword
                ? `No contacts found for "${keyword}"`
                : labelsParam
                ? `No contacts found with selected labels`
                : "No contacts found"
            }</p>
          </div>
        </td>
      </tr>
    `;
    feather.replace();
    return;
  }

  // Render contacts
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
    <tr 
      class="border-t border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors group"
      onclick="detailContactPage(${contact.id})"
    >
      <td class="px-4 py-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 lg:w-8 lg:h-8 ${
            contact.color
          } rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-xs flex-shrink-0">
            ${initials}
          </div>
          <div class="min-w-0 flex-1">
            <div class="font-medium text-gray-900 text-base lg:text-md flex justify-between items-start">
              <span>${contact.fullName}</span>
              <button
                class="lg:hidden text-red-600 hover:text-red-800 transition-colors delete-button p-1 rounded hover:bg-red-50 ml-2 flex-shrink-0"
                title="Delete"
                data-id="${contact.id}"
                onclick="event.stopPropagation(); showDeleteConfirmationModal(${
                  contact.id
                })"
              >
                <i data-feather="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
            <div class="lg:hidden mt-2 space-y-1">
              ${
                contact.phone
                  ? `
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <i data-feather="phone" class="w-4 h-4 text-gray-400"></i>
                <span>${contact.phone}</span>
              </div>
              `
                  : ""
              }
              ${
                contact.email
                  ? `
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <i data-feather="mail" class="w-4 h-4 text-gray-400"></i>
                <span class="truncate">${contact.email}</span>
              </div>
              `
                  : ""
              }
              ${
                contact.birthdate
                  ? `
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <i data-feather="calendar" class="w-4 h-4 text-gray-400"></i>
                <span>${formattedBirthdate(contact.birthdate)}</span>
              </div>
              `
                  : ""
              }
              ${
                contact.labels && contact.labels.length > 0
                  ? `<div class="flex flex-wrap gap-1 mt-2">
                     ${contact.labels
                       .map(
                         (label) =>
                           `<span class="px-2 py-1 ${getLabelColorClass(
                             label
                           )} text-xs rounded">${label}</span>`
                       )
                       .join("")}
                   </div>`
                  : ""
              }
            </div>
          </div>
        </div>
      </td>
      <td class="px-4 py-4 text-gray-600 hidden lg:table-cell">${
        contact.phone ?? "-"
      }</td>
      <td class="px-4 py-4 text-gray-600 hidden lg:table-cell">${
        contact.email ?? "-"
      }</td>
      <td class="px-4 py-4 text-gray-600 hidden lg:table-cell">${formattedBirthdate(
        contact.birthdate
      )}</td>
      <td class="px-4 py-4 hidden lg:table-cell">
        <div class="flex flex-wrap gap-1">${labelsString}</div>
      </td>
      <td class="px-4 py-4 text-center hidden lg:table-cell">
        <button
          class="text-red-600 hover:text-red-800 transition-colors delete-button p-2 rounded-lg hover:bg-red-50"
          title="Delete"
          data-id="${contact.id}"
          onclick="event.stopPropagation(); showDeleteConfirmationModal(${
            contact.id
          })"
        >
          <i data-feather="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    </tr>
  `;

    contactsContainer.innerHTML += contactRow;
  });

  feather.replace();
}

function updateContactQuantity(
  element,
  currentQuantity,
  totalQuantity,
  keyword,
  labelsParam
) {
  if (!element) return;

  const quantityNumber = element.querySelector(".contact-quantity-number");
  const quantityText = element.querySelector(".contact-quantity-text");

  if (quantityNumber) {
    quantityNumber.textContent = currentQuantity;
  }

  if (quantityText) {
    if (keyword || labelsParam) {
      quantityText.textContent = `of ${totalQuantity}`;
    } else {
      quantityText.textContent = "";
    }
  }
}

function detailContactPage(id) {
  window.location.href = `/detail/?id=${id}`;
}

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
  initializeMobileNavigation();
  renderContacts();
});
