const express = require("express");
const router = express.Router();
const ctrlContact = require("../../controller/contacts");
const { authenticate } = require("../../middlewares/authenticate");
const {
  validateAddContact,
  validateUpdateContact,
  validateUpdateStatusContact,
} = require("../../middlewares/validation");

router.get("/", authenticate, ctrlContact.listContacts);

router.get("/:contactId", authenticate, ctrlContact.getContactById);

router.delete("/:contactId", authenticate, ctrlContact.removeContact);

router.post("/", authenticate, validateAddContact, ctrlContact.addContact);

router.put(
  "/:contactId",
  authenticate,
  validateUpdateContact,
  ctrlContact.updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  validateUpdateStatusContact,
  ctrlContact.updateStatusContact
);

module.exports = router;
