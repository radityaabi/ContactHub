const saveContactsToStorage = (contacts) => {
  localStorage.setItem("contacts-data", JSON.stringify(contacts));
};

const loadContactsFromStorage = () => {
  const contacts = localStorage.getItem("contacts-data");

  if (!contacts) {
    return [];
  }

  try {
    return JSON.parse(contacts);
  } catch (error) {
    console.error("Failed to parse contacts from localStorage:", error);

    return [];
  }
};
