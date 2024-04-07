const service = require("../../service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const uuid = require("uuid");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL;
const { sendEmail } = require("../../helpers/sendEmail");

const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await service.getUserByEmail(email);
    if (!user) {
      res.status(404).json({
        status: "Not Found",
        code: 404,
        message: "Email not found",
      });
      return;
    }
    if (user.verify) {
      res.status(400).json({
        status: "Bad request",
        code: 400,
        message: "Verification has already been passed",
      });
      return;
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}:${PORT}/api/users/verify/${user.verificationToken}">Click to verify the email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(200).json({
      status: "OK",
      code: 200,
      message: "Verification email sent",
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await service.getUserByVerificationToken(verificationToken);
    if (!user) {
      res.status(404).json({
        status: "Not Found",
        code: 404,
        message: "User not found",
      });
      return;
    }
    const result = await service.updateUser(
      user._id,
      { verify: true, verificationToken: null },
      { new: true }
    );
    res.status(200).json({
      status: "OK",
      code: 200,
      message: "Verification successful",
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const signUp = async (req, res, next) => {
  const { email, password, subscription } = req.body;
  try {
    const user = await service.getUserByEmail(email);
    if (user) {
      res.status(409).json({
        status: "Conflict",
        code: 409,
        message: "Email in use",
        data: "Email in use",
      });
      return;
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email);
    console.log(avatarUrl);
    const verificationToken = uuid.v4();

    const result = await service.addUser({
      email,
      password: hashPassword,
      subscription,
      avatarURL: avatarUrl,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}:${PORT}/api/users/verify/${verificationToken}">Click to verify the email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      status: "Created",
      code: 201,
      data: {
        user: {
          email: result.email,
          subscription: result.subscription,
          avatarUrl: result.avatarURL,
          verificationToken: result.verificationToken,
        },
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await service.getUserByEmail(email);
    if (!user) {
      res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Email or password is wrong",
        data: "Email or password is wrong",
      });
      return;
    }

    if (!user.verify) {
      res.status(400).json({
        status: "Bad Request",
        code: 400,
        message: "Email is not verified",
        data: "Email is not verified",
      });
      return;
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Email or password is wrong",
        data: "Email or password is wrong",
      });
      return;
    }

    const payload = {
      id: user._id,
    };

    const { SECRET_KEY } = process.env;

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "10h" });
    const result = await service.addTokenToUser(user._id, token);

    res.status(200).json({
      status: "OK",
      code: 200,
      data: {
        token: result.token,
        user: { email: result.email, subscription: result.subscription },
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    if (!id) {
      res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Not authorized",
        data: "Not authorized",
      });
      return;
    }

    const result = await service.addTokenToUser(id, null);

    res.status(204).json({
      status: "No Content",
      code: 204,
      message: "Logout success",
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { id } = req.user;
    if (!id) {
      res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Not authorized",
        data: "Not authorized",
      });
      return;
    }

    const { email, subscription } = req.user;

    res.status(200).json({
      status: "OK",
      code: 200,
      data: {
        email: email,
        subscription: subscription,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const resizedAvatar = await Jimp.read(tempUpload);
    resizedAvatar
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(tempUpload);

    const extension = originalname.split(".").pop();
    const filename = `${id}.${extension}`;
    const avatarsDir = path.join(__dirname, "../../", "public", "avatars");
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    const result = await service.updateUser(id, { avatarURL }, { new: true });
    res.status(200).json({
      status: "OK",
      code: 200,
      data: {
        avatarURL: result.avatarURL.replace(/\\/g, path.sep),
      },
    });
  } catch (e) {
    console.error(e);
    await fs.unlink(req.file.path);
    next(e);
  }
};

module.exports = {
  signUp,
  login,
  logout,
  getCurrent,
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
};
