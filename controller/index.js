const service = require("../service");
const Joi = require("joi");

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

const contactPatchSchema = Joi.object({
  favorite: Joi.string().required(),
});

const listContacts = async (req, res, next) => {
  try {
    const results = await service.getAllContacts();

    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await service.getContactById(contactId);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const result = await service.removeContact(contactId);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        message: "contact deleted",
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${id}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const addContact = async (req, res, next) => {
  const { error } = contactPostSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "missing required name field",
      data: "missing required name field",
    });
  } else {
    try {
      const result = await service.addContact(req.body);

      res.status(201).json({
        status: "success",
        code: 201,
        data: { contact: result },
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
};

const updateContact = async (req, res, next) => {
  const { error } = contactPutSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "missing fields",
      data: "missing fields",
    });
  } else {
  }

  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  try {
    const result = await service.updateContact(contactId, {
      name,
      email,
      phone,
    });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Not found contact id: ${contactId}`,
        data: "Not Found",
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateStatusContact = async (req, res, next) => {
  const { error } = contactPatchSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "missing field favorite",
      data: "missing field favorite",
    });
  } else {
    const { contactId } = req.params;
    const { favorite = false } = req.body;

    try {
      const result = await service.updateContact(contactId, { favorite });
      if (result) {
        res.json({
          status: "success",
          code: 200,
          data: { contact: result },
        });
      } else {
        res.status(404).json({
          status: "error",
          code: 404,
          message: `Not found contact id: ${contactId}`,
          data: "Not Found",
        });
      }
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
