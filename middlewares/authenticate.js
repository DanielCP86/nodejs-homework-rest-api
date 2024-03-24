const jwt = require("jsonwebtoken");
const service = require("../service");

const authenticate = async (req, res, next) => {
  try {
    const { authorization = " " } = await req.headers;
    const [bearer = "", token = ""] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) {
      res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
      return;
    }
    const { SECRET_KEY } = process.env;
    const { id } = await jwt.verify(token, SECRET_KEY);
    const user = await service.getUserById(id);
    if (!user || !user.token) {
      res.status(401).json({
        status: "Unauthorized",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
      return;
    }
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = { authenticate };
