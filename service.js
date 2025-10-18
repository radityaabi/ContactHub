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
//      🙎${contact.name}
//      📱${contact.phone}
//      📧${email || "-"}
//      🎂${birthdateString}
//      🏠${contact.address || "-"}
//      🏷️Labels: ${labelsString}
//     `);
// }

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
    contact.name.toLowerCase().includes(keyword.toLowerCase())
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
    name: newContactData.name ?? "Unknown",
    phone: newContactData.phone ?? null,
    email: newContactData.email ?? null,
    birthdate: newContactData.birthdate ?? null,
    address: newContactData.address ?? null,
    labels: Array.isArray(newContactData.labels) ? newContactData.labels : [],
  };

  const isPhoneExisted = newContact.phone
    ? dataContacts.some((contact) => contact.phone === newContact.phone)
    : false;

  if (isPhoneExisted) {
    console.error("Phone already exists in contacts");
    return dataContacts;
  }

  const updatedContacts = [...dataContacts, newContact];
  console.log("Contact added:", newContact);
  saveContactsToStorage(updatedContacts);
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
