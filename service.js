// function renderContacts(dataContacts) {
//   contacts.forEach((contact) => renderContact(contact));
// }

// function renderContact(contact) {
//   const { email, birthdate } = contact;
//   const labelsString = contact.labels.length ? contact.labels.join(", ") : "-";
//   const birthdateString = birthdate
//     ? new Date(birthdate).toLocaleDateString("en-US", medium)
//     : "-";
//   console.log(`
//      🙎${contact.fullName}
//      📱${contact.phone}
//      📧${email || "-"}
//      🎂${birthdateString}
//      🏠${contact.address || "-"}
//      🏷️Labels: ${labelsString}
//     `);
// }

const showNotification = (message, type = "info") => {
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
  }, 3000);
};

function getContactDetailsById(dataContacts, id) {
  const contact = dataContacts.find((contact) => contact.id === id);

  if (contact) {
    renderContact(contact);
  } else {
    console.log("Contact not found");
  }
}

function searchContacts(dataContacts, keyword) {
  return dataContacts.filter((contact) =>
    contact.fullName.toLowerCase().includes(keyword.toLowerCase())
  );
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
  };

  if (newContact.fullName.trim() === "") {
    showNotification("Full name is required to add a contact.", "error");
    return dataContacts;
  }

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
    goToHomePage();
  }, 3000);
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

function editContactById(dataContacts, id, updatedInfo) {
  const updatedContacts = dataContacts.map((contact) => {
    if (contact.id === id) {
      return { ...contact, ...updatedInfo };
    }
    return contact;
  });

  console.log("Contact updated:", { id, ...updatedInfo });
  saveContactsToStorage(updatedContacts);
  goToHomePage();
}
