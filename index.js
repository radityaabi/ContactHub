// Contacts Data
let contacts = [
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

const service = {
  showContact: function (contact) {
    const { email, birthdate } = contact;
    const labelsString = contact.labels.length
      ? contact.labels.join(", ")
      : "-";

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
  },

  showContacts: function () {
    for (let index in contacts) {
      const contact = contacts[index];
      this.showContact(contact);
    }
  },

  searchContacts: function (dataContacts, keyword) {
    return dataContacts.filter((contact) =>
      contact.name.toLowerCase().includes(keyword.toLowerCase())
    );
  },

  getContactDetailsById: function (dataContacts, id) {
    const contact = dataContacts.find((contact) => contact.id === id);

    if (contact) {
      this.showContact(contact);
    } else {
      console.log("Contact not found");
    }
  },

  addContact(dataContacts, newContactData) {
    const isPhoneExisted = newContactData.phone
      ? dataContacts.some((contact) => contact.phone === newContactData.phone)
      : false;

    if (isPhoneExisted) {
      console.error("Phone already exists in contacts");
      return dataContacts;
    }

    const lastId = dataContacts.length
      ? Math.max(...dataContacts.map((contact) => contact.id))
      : 0;

    const newContact = {
      id: lastId + 1,
      name: newContactData.name ?? "Unknown",
      phone: newContactData.phone ?? null,
      email: newContactData.email ?? null,
      birthdate: newContactData.birthdate ?? null,
      address: newContactData.address ?? null,
      labels: Array.isArray(newContactData.labels) ? newContactData.labels : [],
    };

    const updatedContacts = [...dataContacts, newContact];
    console.log("Contact added:", newContact);
    return updatedContacts;
  },

  deleteContactById(dataContacts, id) {
    const contact = dataContacts.find((contact) => contact.id === id);
    if (!contact) {
      console.log("Contact not found");
      return dataContacts;
    }

    const updatedContacts = dataContacts.filter((contact) => contact.id !== id);
    console.log("Contact deleted:", contact);
    return updatedContacts;
  },

  updateContactById(dataContacts, id, updatedInfo) {
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
    return updatedContacts;
  },
};

// SHOW ALL CONTACTS
service.showContacts();

// SEARCH CONTACTS
console.log(`Search Contact Result:`, service.searchContacts(contacts, "jaNE"));

// SHOW CONTACT DETAILS
service.getContactDetailsById(contacts, 4);

// ADD NEW CONTACT
contacts = service.addContact(contacts, {
  name: "Yuli Mardani",
  phone: "0899-9999-9999",
  birthdate: new Date("1999-09-09"),
  address: "Mustikasari, Bekasi, Indonesia",
  labels: ["family"],
});

contacts = service.addContact(contacts, {
  name: "Yuli Mardani",
  phone: "0899-9999-9999",
  email: null,
  birthdate: new Date("1999-09-09"),
  address: "Mustikasari, Bekasi, Indonesia",
  labels: ["family"],
});

// SHOW ALL CONTACTS AFTER ADDING NEW ONE
service.showContacts();

// DELETE A CONTACT
contacts = service.deleteContactById(contacts, 2);

// DELETE WRONG ID
contacts = service.deleteContactById(contacts, 10);

// SHOW ALL CONTACTS AFTER DELETION
service.showContacts();

// UPDATE A CONTACT
contacts = service.updateContactById(contacts, 3, {
  name: "Raditya Abiansyah",
  email: null,
  phone: "0877-3297-0056",
  address: "Cipinang Muara, Jakarta, Indonesia",
  birthdate: new Date("1999-12-08"),
  labels: [],
});

// UPDATE WRONG ID
contacts = service.updateContactById(contacts, 10, {
  name: "Rayna Yuranza",
});

// SHOW ALL CONTACTS AFTER DELETION AND UPDATE
service.showContacts();
