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
  showContacts: function () {
    for (let index in contacts) {
      const contact = contacts[index];
      const { email, birthdate } = contact;
      const labelsString = contact.labels.length
        ? contact.labels.join(", ")
        : "-";

      console.log(`
          🙎${contact.name} 
          📱${contact.phone}
          📧${email || "-"}
          🎂${
            birthdate instanceof Date
              ? birthdate.toISOString().split("T")[0]
              : "-"
          }
          🏷️Labels: ${labelsString}
          `);
    }
  },

  searchContacts: function (keyword) {
    // Filter contacts by name (case insensitive)
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(keyword.toLowerCase())
    );
  },

  getContactDetailsById: function (id) {
    // Find contact by ID
    const contact = contacts.find((contact) => contact.id === id);

    if (contact) {
      const { email, birthdate, address } = contact;
      const labelsString = contact.labels.length
        ? contact.labels.join(", ")
        : "-";

      console.log(`
        ...  🙎${contact.name} 
          📱${contact.phone}
          📧${email || "-"}
          🎂${
            birthdate instanceof Date
              ? birthdate.toISOString().split("T")[0]
              : "-"
          }
          🏠${address || "-"}
          🏷️Labels: ${labelsString}
          `);
    } else {
      console.log("Contact not found");
    }
  },

  addContact(newContactData) {
    // Check for duplicate phone number
    const isDoublePhoneNumber = newContactData.phone
      ? contacts.some((contact) => contact.phone === newContactData.phone)
      : false;

    if (isDoublePhoneNumber)
      return console.log("Phone number already exists in contacts");

    // Assign a new ID
    newContactData.id = contacts.at(-1)?.id + 1 || 1;
    // Add new contact to array
    contacts = [...contacts, newContactData];
    console.log("Contact added:", newContactData);
  },

  deleteContactById(id) {
    // Find contact by ID
    const contact = contacts.find((contact) => contact.id === id);
    if (!contact) return console.log("Contact not found");

    // Remove contact from array
    contacts = contacts.filter((contact) => contact.id !== id);
    console.log("Contact deleted:", contact);
  },

  updateContactById(id, updatedInfo) {
    // Declare found flag
    let isFound = false;

    // Update contact info by ID using map
    contacts = contacts.map((contact) => {
      if (contact.id === id) {
        isFound = true;
        return { ...contact, ...updatedInfo };
      }
      return contact;
    });

    if (!found) return console.log("Contact not found");
    console.log("Contact updated:", { id, ...updatedInfo });
  },
};

// SHOW ALL CONTACTS
service.showContacts();

// SEARCH CONTACTS
console.log(`Search Contact Result:`, service.searchContacts("jaNE"));

// SHOW CONTACT DETAILS
service.getContactDetailsById(4);

// ADD NEW CONTACT
service.addContact({
  name: "Yuli Mardani",
  phone: "0899-9999-9999",
  email: null,
  birthdate: new Date("1999-09-09"),
  address: "Mustikasari, Bekasi, Indonesia",
  labels: ["family"],
});

service.addContact({
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
service.deleteContactById(2);

// DELETE WRONG ID
service.deleteContactById(10);

// SHOW ALL CONTACTS AFTER DELETION
service.showContacts();

// UPDATE A CONTACT
service.updateContactById(3, {
  name: "Raditya Abiansyah",
  email: null,
  phone: "0877-3297-0056",
  address: "Cipinang Muara, Jakarta, Indonesia",
  birthdate: new Date("1999-12-08"),
  labels: [],
});

// UPDATE WRONG ID
service.updateContactById(10, {
  name: "Rayna Yuranza",
});

// SHOW ALL CONTACTS AFTER DELETION AND UPDATE
service.showContacts();
