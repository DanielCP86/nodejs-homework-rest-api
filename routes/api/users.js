const express = require("express");
const router = express.Router();
const ctrlUser = require("../../controller/users");
const {
  validateRegister,
  validateLogin,
} = require("../../middlewares/validation");
const { authenticate } = require("../../middlewares/authenticate");

router.post("/signup", validateRegister, ctrlUser.signUp);
router.post("/login", validateLogin, ctrlUser.login);
router.get("/logout", authenticate, ctrlUser.logout);
router.get("/current", authenticate, ctrlUser.getCurrent);

module.exports = router;
