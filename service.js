const goToDashboardPage = () => {
  window.location = "/";
};

function getInitials(name) {
  if (!name) return "NA";
  let words = name.trim().split(" ");
  let initials = "";
  for (let i = 0; i < words.length && initials.length < 2; i++) {
    if (words[i].length > 0) initials += words[i][0].toUpperCase();
  }
  return initials;
}

function getColorForInitial(initials) {
  let colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];

  let index = initials.charCodeAt(0) % colors.length;
  return colors[index];
}

function getLabelColorClass(label) {
  const colorMap = {
    work: "bg-blue-100 text-blue-800",
    friend: "bg-green-100 text-green-800",
    family: "bg-purple-100 text-purple-800",
    client: "bg-orange-100 text-orange-800",
  };

  return colorMap[label.toLowerCase()] || "bg-gray-100 text-gray-800";
}

function formattedBirthdate(birthdate) {
  if (birthdate) {
    try {
      return new Date(birthdate).toLocaleString("en-US", {
        dateStyle: "long",
      });
    } catch (error) {
      return "Invalid Date";
    }
  }
  return "-";
}

function showNotification(message, type = "info") {
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
}

function getContactDetailsById(dataContacts, id) {
  const contact = dataContacts.find((contact) => contact.id === id);
  return contact;
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
    goToDashboardPage();
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

function editContactById(dataContacts, id, updatedFields) {
  //VALIDATION SECTION
  if (!updatedFields.phone && !updatedFields.email) {
    showNotification(
      "At least one contact method (phone or email) is required.",
      "error"
    );
    return dataContacts;
  }

  //UPDATE SECTION
  const updatedContacts = dataContacts.map((contact) => {
    if (contact.id === id) {
      return { ...contact, ...updatedFields };
    }
    return contact;
  });

  saveContactsToStorage(updatedContacts);
  showNotification("Contact updated succesfully", "success");
  setTimeout(() => {
    goToDashboardPage();
  }, 3000);
}
