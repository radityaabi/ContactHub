// Contacts Data
const contacts = [
  {
    id: 1,
    name: "John Doe",
    phone: "123-456-7890",
    email: "johndoe@gmail.com",
    birthdate: "1990-01-01",
    address: "123 Main St, Anytown, USA",
    labels: ["friend", "work"],
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "987-654-3210",
    email: "janesmith@gmail.com",
    birthdate: "1985-05-15",
    address: "456 Oak St, Sometown, USA",
    labels: ["family"],
  },
  {
    id: 3,
    name: "Alice Johnson",
    phone: "555-123-4567",
    email: "alicejohnson@gmail.com",
    birthdate: "1992-09-30",
    address: "789 Pine St, Othertown, USA",
    labels: ["work"],
  },
  {
    id: 4,
    name: "Bob Brown",
    phone: "444-987-6543",
    email: "bobbrown@gmail.com",
    birthdate: "1988-12-12",
    address: "321 Maple St, Newtown, USA",
    labels: ["friend"],
  },
  {
    id: 5,
    name: "Charlie Davis",
    phone: "333-222-1111",
    email: "charliedavis@outlook.com",
    birthdate: "1995-07-07",
    address: "654 Cedar St, Oldtown, USA",
    labels: ["family", "work"],
  },
];

console.log("Contacts:", contacts);

// Display Contacts in the DOM
const contactList = document.createElement("ul");

contacts.forEach((contact) => {
  // Create list item for each contact
  const listItem = document.createElement("li");
  listItem.innerHTML = `
        <strong>${contact.name}</strong><br/>
        Phone: ${contact.phone}<br/>
        Email: <a href="mailto:${contact.email}">${contact.email}</a><br/>
        Birthday: ${new Date(contact.birthdate).toLocaleString("id-ID", {
          dateStyle: "medium",
        })}<br/>
        Address: ${contact.address}<br/>
        Labels: ${contact.labels.join(", ")}
    `;
  // Append list item to the contact list
  contactList.appendChild(listItem);
});

// Append contact list to the body
document.body.appendChild(contactList);
