const contact = require("./schemas/contact");
const user = require("./schemas/user");
const contactSchemas = contact.contactSchemas;
const userSchemas = user.userSchemas;
const contactModel = contact.Contact;
const userModel = user.User;

const getAllContacts = async () => {
  return contactModel.find();
};

const getContactById = (id) => {
  return contactModel.findOne({ _id: id });
};

const removeContact = (id) => {
  return contactModel.findByIdAndDelete({ _id: id });
};

const addContact = ({ name, email, phone }) => {
  return contactModel.create({ name, email, phone });
};

const updateContact = (id, fields) => {
  return contactModel.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const getUserByEmail = (email) => {
  return userModel.findOne({ email: email });
};

const getUserById = (id) => {
  return userModel.findOne({ _id: id });
};

const getUserByVerificationToken = (verificationToken) => {
  return userModel.findOne({ verificationToken: verificationToken });
};

const addUser = ({
  email,
  password,
  subscription,
  avatarURL,
  verificationToken,
}) => {
  return userModel.create({
    email,
    password,
    subscription,
    avatarURL,
    verificationToken,
  });
};

const updateUser = (id, fields) => {
  return userModel.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const addTokenToUser = (id, token) => {
  const updatedUser = userModel.findByIdAndUpdate(
    id,
    { token: token },
    { new: true }
  );
  return updatedUser;
};

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  getUserByEmail,
  addUser,
  contactSchemas,
  userSchemas,
  addTokenToUser,
  getUserById,
  getUserByVerificationToken,
  updateUser,
};
