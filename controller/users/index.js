const service = require("../../service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const result = await service.addUser({
      email,
      password: hashPassword,
      subscription,
    });

    res.status(201).json({
      status: "Created",
      code: 201,
      data: {
        user: { email: result.email, subscription: result.subscription },
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

module.exports = { signUp, login, logout, getCurrent };
