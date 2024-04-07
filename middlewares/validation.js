const { userSchemas, contactSchemas } = require("../service");

const validateRegister = (req, res, next) => {
  const { error } = userSchemas.registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "Bad Request",
      code: 400,
      message: "Eroare de la librăria Joi sau o altă librărie de validare",
      data: error.message,
    });
  }
  next();
};

const validateResendVerificationEmail = (req, res, next) => {
  const { error } = userSchemas.resendVerificationEmailSchema.validate(
    req.body
  );
  if (error) {
    return res.status(400).json({
      status: "Bad Request",
      code: 400,
      message:
        "Eroare de la librăria Joi sau o altă librărie de validare (missing required field email)",
      data: error.message,
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = userSchemas.loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "Bad Request",
      code: 400,
      message: "Eroare de la librăria Joi sau o altă librărie de validare",
      data: error.message,
    });
  }
  next();
};

const validateAddContact = (req, res, next) => {
  const { error } = contactSchemas.contactPostSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "missing required name field",
      data: error.message,
    });
  }
  next();
};

const validateUpdateContact = (req, res, next) => {
  const { error } = contactSchemas.contactPutSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "missing fields",
      data: error.message,
    });
  }
  next();
};

const validateUpdateStatusContact = (req, res, next) => {
  const { error } = contactSchemas.contactPatchSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "missing field favorite",
      data: error.message,
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateAddContact,
  validateUpdateContact,
  validateUpdateStatusContact,
  validateResendVerificationEmail,
};
