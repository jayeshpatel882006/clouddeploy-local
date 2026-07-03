import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "clouddeploy-dev-secret";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(ApiError.unauthorized("No token provided"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).lean();
    if (!user || !user.isActive) {
      return next(ApiError.unauthorized("User not found or inactive"));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Invalid or expired token"));
    }
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ApiError.forbidden("Insufficient permissions"));
    }
    next();
  };
};

export { authenticate, authorize };
