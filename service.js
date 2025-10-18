function showContacts(dataContacts) {
  contacts.forEach((contact) => showContact(contact));
}

function showContact(contact) {
  const { email, birthdate } = contact;
  const labelsString = contact.labels.length ? contact.labels.join(", ") : "-";

  console.log(`
     🙎${contact.name} 
     📱${contact.phone}
     📧${email || "-"}
     🎂${birthdateString}
     🏠${contact.address || "-"}
     🏷️Labels: ${labelsString}
    `);
}

function searchContacts(dataContacts, keyword) {
  return dataContacts.filter((contact) =>
    contact.name.toLowerCase().includes(keyword.toLowerCase())
  );
}

function getContactDetailsById(dataContacts, id) {
  const contact = dataContacts.find((contact) => contact.id === id);

  if (contact) {
    showContact(contact);
  } else {
    console.log("Contact not found");
  }
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
  loadContactsToStorage(updatedContacts);
}

function deleteContactById(dataContacts, id) {
  try {
    const updatedContacts = dataContacts.filter((contact) => contact.id !== id);
    console.log("Contact deleted with id:", id);
    loadContactsToStorage(updatedContacts);
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
  loadContactsToStorage(updatedContacts);
}
