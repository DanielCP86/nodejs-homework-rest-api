const express = require("express");
const router = express.Router();
const ctrlContact = require("../../controller");

router.get("/", ctrlContact.listContacts);

router.get("/:contactId", ctrlContact.getContactById);

router.delete("/:contactId", ctrlContact.removeContact);

router.post("/", ctrlContact.addContact);

router.put("/:contactId", ctrlContact.updateContact);

router.patch("/:contactId/favorite", ctrlContact.updateStatusContact);

module.exports = router;
