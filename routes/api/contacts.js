const express = require("express");
const contactsOperations = require("../../models/contacts");
const createError = require("http-errors");
const Joi = require("joi");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const result = await contactsOperations.listContacts();
  res.json({
    status: "success",
    code: 200,
    data: {
      result,
    },
  });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contactsOperations.getContactById(contactId);
  if (!result) {
    const notFoundError = createError(404, "Not Found");
    next(notFoundError);
    return;
  }
  res.json({
    status: "success",
    code: 200,
    data: {
      result,
    },
  });
});

const contactPostSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const contactPutSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
}).or("name", "email", "phone");

router.post("/", async (req, res, next) => {
  const { error } = contactPostSchema.validate(req.body);
  if (error) {
    next(createError(400, "missing required name field"));
    return;
  }
  const result = await contactsOperations.addContact(req.body);
  res.status(201).json({ status: "success", code: 201, data: { result } });
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contactsOperations.removeContact(contactId);
  if (!result) {
    next(createError(404, `Not found`));
    return;
  }
  res.json({
    status: "success",
    code: 200,
    message: "contact deleted",
    data: { result },
  });
});

router.put("/:contactId", async (req, res, next) => {
  const { error } = contactPutSchema.validate(req.body);
  if (error) {
    next(createError(400, "missing fields"));
    return;
  }
  const { contactId } = req.params;
  const result = await contactsOperations.updateContact(contactId, req.body);
  if (!result) {
    next(createError(404, `Not found`));
  }
  res.json({
    status: "success",
    code: 200,
    data: {
      result,
    },
  });
});

module.exports = router;
