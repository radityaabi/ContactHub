# 📒 ContactHub

A simple contact management application using browser storage.

## ✨ Features

- ✅ Add New Contact - Store name, phone, email, address
- 📋 View All Contacts - See complete contact list
- 🔍 Search Contacts - Find contacts by keyword
- 👁️ View Contact Details - See full contact information
- ✏️ Edit Contacts - Update existing contact data
- 🗑️ Delete Contacts - Remove unwanted contacts
- 💾 Auto Save - Data automatically saved to localStorage

## 🚀 Quick Start

1. Open index.html in browser
2. Choose from main menu options
3. Follow on-screen instructions
4. Data saves automatically to browser storage

## 📝 Menu Options

### === MAIN MENU ===

1. Add Contact
2. View Contacts
3. Search Contacts
4. Contact Details
5. Update Contact
6. Delete Contact
7. Exit

## 🔧 Core Functions

- Storage Management (storage.js)
- loadContacts() - Load from localStorage
- saveContacts(contacts) - Save to localStorage
- initializeStorage() - Setup initial data structure

### Contact Operations

1. addContact() - Add new contact
2. showContacts() - Show all contacts
3. searchContacts(keyword) - Find contacts
4. getContactDetails(id) - Show full details
5. updateContact(id, newData) - Modify contact
6. deleteContact(id) - Remove contact

## 💾 Data Storage

- Technology: localStorage API
- Key: addressBookContacts
- Format: JSON array of contacts
- Auto-save after every change
- Auto-load on page load

## 📋 Contact Structure

```javascript
{
    id: "unique-id",
    name: "John Doe", // ✅ Required
    phone: "08123456789", // ✅ Required
    birthdate: "1992-09-30", // ❌ Optional
    email: "john@example.com", // ❌ Optional
    address: "Jakarta", // ❌ Optional
    labels: ["client", "family", "friend", "work"] // ❌ Optional
}
```

## 🛡️ Validation

- ✅ Name and phone are required
- ✅ Unique ID generation
- ✅ Delete confirmation
- ✅ Empty fields = no change (edit)
- ✅ Data persistence across browser sessions
