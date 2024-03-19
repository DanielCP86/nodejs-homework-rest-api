const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const contactPostSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
});

const contactPutSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
}).or("name", "email", "phone", "owner");

const contactPatchSchema = Joi.object({
  favorite: Joi.string().required(),
});

const contact = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const Contact = mongoose.model("contact", contact);
const contactSchemas = {
  contactPostSchema,
  contactPutSchema,
  contactPatchSchema,
};

module.exports = {
  Contact,
  contactSchemas,
};
