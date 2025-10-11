// Contacts Data
const contacts = [
  {
    id: 1,
    name: "John Doe",
    phone: "123-456-7890",
    email: "johndoe@gmail.com",
    birthdate: new Date("1990-01-01"),
    address: "123 Main St, Anytown, USA",
    labels: ["friend", "work"],
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "987-654-3210",
    email: "janesmith@gmail.com",
    birthdate: new Date("1985-05-15"),
    address: "456 Oak St, Sometown, USA",
    labels: ["family"],
  },
  {
    id: 3,
    name: "Alice Johnson",
    phone: "555-123-4567",
    email: "alicejohnson@gmail.com",
    birthdate: new Date("1992-09-30"),
    address: "789 Pine St, Othertown, USA",
    labels: ["work"],
  },
  {
    id: 4,
    name: "Bob Brown",
    phone: "444-987-6543",
    email: "bobbrown@gmail.com",
    birthdate: new Date("1988-12-12"),
    address: "321 Maple St, Newtown, USA",
    labels: ["friend"],
  },
  {
    id: 5,
    name: "Charlie Davis",
    phone: "333-222-1111",
    email: "charliedavis@outlook.com",
    birthdate: new Date("1995-07-07"),
    address: "654 Cedar St, Oldtown, USA",
    labels: ["family", "work"],
  },
];

console.log("Contacts:", contacts);

function showContacts() {
  for (let contact = 0; contact < contacts.length; contact++) {
    if (contacts[contact].email === null) {
      contacts[contact].email = "-";
    }

    if (contacts[contact].birthdate === null) {
      contacts[contact].birthdate = "-";
    }

    if (contacts[contact].labels.length === 0) {
      contacts[contact].labels.push("-");
    }

    console.log(`
      ${contacts[contact].name} 
      ${contacts[contact].phone}
      ${contacts[contact].email}
      ${contacts[contact].birthdate.toDateString()}
      Labels: ${contacts[contact].labels.join(", ")}
      `);
  }
}

function searchContacts(query) {
  return contacts.filter((contact) =>
    contact.name.toLowerCase().includes(query.toLowerCase())
  );
}

function showContactDetails(id) {
  const contact = contacts.find((c) => c.id === id);

  if (contact.email === null) {
    contact.email = "-";
  }

  if (contact.birthdate === null) {
    contact.birthdate = "-";
  }

  if (contact.address === null) {
    contact.address = "-";
  }

  if (contact.labels.length === 0) {
    contact.labels.push("-");
  }

  if (contact) {
    console.log("Contact Details:", contact);
  } else {
    console.log("Contact not found");
  }
}

function addContact(contact) {
  contacts.push(contact);
  console.log("Contact added:", contact);
}

function deleteContact(id) {
  const index = contacts.findIndex((c) => c.id === id);
  if (index !== -1) {
    const removed = contacts.splice(index, 1);
    console.log("Contact deleted:", removed[0]);
  } else {
    console.log("Contact not found");
  }
}

function updateContact(id, updatedInfo) {
  const contact = contacts.find((c) => c.id === id);
  if (contact) {
    Object.assign(contact, updatedInfo);
    console.log("Contact updated:", contact);
  } else {
    console.log("Contact not found");
  }
}

// SHOW ALL CONTACTS
showContacts();

// SEARCH CONTACTS
console.log(`Search Contact :`, searchContacts("jaNE"));

// SHOW CONTACT DETAILS
showContactDetails(4);

// ADD NEW CONTACT
addContact({
  id: 6,
  name: "Yuli Mardani",
  phone: "0899-9999-9999",
  email: null,
  birthdate: new Date("1999-09-09"),
  address: "Mustikasari, Bekasi, Indonesia",
  labels: ["family"],
});

// SHOW ALL CONTACTS AFTER ADDING NEW ONE
showContacts();

// DELETE A CONTACT
deleteContact(2);

// DELETE WRONG ID
deleteContact(10);

// SHOW ALL CONTACTS AFTER DELETION
showContacts();

// UPDATE A CONTACT
updateContact(3, {
  name: "Raditya Abiansyah",
  email: null,
  phone: "0877-3297-0056",
  address: "Cipinang Muara, Jakarta, Indonesia",
  birthdate: new Date("1999-12-08"),
  labels: [],
});

// UPDATE WRONG ID
updateContact(10, {
  name: "Rayna Yuranza",
});

// SHOW ALL CONTACTS AFTER DELETION AND UPDATE
showContacts();
