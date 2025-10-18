// Contacts Data
const initialContacts = [
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
];

const setInitialContacts = () => {
  const contacts = loadContactsToStorage();

  if (contacts.length === 0) {
    saveContactsToStorage(initialContacts);
  }
};

// Initialize contacts from localStorage or set initial contacts
setInitialContacts();
let contacts = loadContactsToStorage();

// SHOW ALL CONTACTS
showContacts(contacts);

// SEARCH CONTACTS
console.log(`Search Contact Result:`, searchContacts(contacts, "jaNE"));

// SHOW CONTACT DETAILS
getContactDetailsById(contacts, 2);

// ADD NEW CONTACT
addContact(contacts, {
  name: "Yuli Mardani",
  phone: "0899-9999-9999",
  birthdate: new Date("1999-09-09"),
  address: "Mustikasari, Bekasi, Indonesia",
  labels: ["family"],
});

// SHOW ALL CONTACTS AFTER ADDING NEW ONE
showContacts(contacts);

// DELETE A CONTACT
deleteContactById(contacts, 2);

// SHOW ALL CONTACTS AFTER DELETION
showContacts(contacts);

// UPDATE A CONTACT
editContactById(contacts, 3, {
  name: "Raditya Abiansyah",
  email: null,
  phone: "0877-3297-0056",
  address: "Cipinang Muara, Jakarta, Indonesia",
  birthdate: new Date("1999-12-08"),
  labels: [],
});

// SHOW ALL CONTACTS AFTER DELETION AND UPDATE
showContacts(contacts);
