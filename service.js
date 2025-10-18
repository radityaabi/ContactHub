function showContact(contact) {
  const { email, birthdate } = contact;
  const labelsString = contact.labels.length ? contact.labels.join(", ") : "-";

  const birtdayString = "";

  console.log(`
     🙎${contact.name} 
     📱${contact.phone}
     📧${email || "-"}
     🎂${
       birthdate instanceof Date ? birthdate.toISOString().split("T")[0] : "-"
     }
     🏠${contact.address || "-"}
     🏷️Labels: ${labelsString}
    `);
}

function showContacts(dataContacts) {
  for (let contact of dataContacts) {
    this.showContact(contact);
  }
}

function searchContacts(dataContacts, keyword) {
  return dataContacts.filter((contact) =>
    contact.name.toLowerCase().includes(keyword.toLowerCase())
  );
}

function getContactDetailsById(dataContacts, id) {
  const contact = dataContacts.find((contact) => contact.id === id);

  if (contact) {
    this.showContact(contact);
  } else {
    console.log("Contact not found");
  }
}

function addContact(dataContacts, newContactData) {
  const lastId = dataContacts.length
    ? Math.max(...dataContacts.map((contact) => contact.id))
    : 0;
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
  setContacts(updatedContacts);
}

function deleteContactById(dataContacts, id) {
  const contact = dataContacts.find((contact) => contact.id === id);
  if (!contact) {
    console.error("Contact not found");
    return dataContacts;
  }

  const updatedContacts = dataContacts.filter((contact) => contact.id !== id);
  console.log("Contact deleted:", contact);
  setContacts(updatedContacts);
}

function editContactById(dataContacts, id, updatedInfo) {
  let found = false;
  const updatedContacts = dataContacts.map((contact) => {
    if (contact.id === id) {
      found = true;
      return { ...contact, ...updatedInfo };
    }
    return contact;
  });

  if (!found) {
    console.error("Contact not found");
    return dataContacts;
  }

  console.log("Contact updated:", { id, ...updatedInfo });
  setContacts(updatedContacts);
}
