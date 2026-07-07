// ==========================================
// FUTURE PHASE
// Auth Service
// ==========================================

// import User from "../models/User.js";
// import ApiError from "../utils/ApiError.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// const JWT_SECRET = process.env.JWT_SECRET || "clouddeploy-dev-secret";
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user._id, email: user.email, role: user.role },
//     JWT_SECRET,
//     { expiresIn: JWT_EXPIRES_IN },
//   );
// };

// const registerUser = async ({ email, password, name }) => {
//   const existing = await User.findOne({ email });
//   if (existing) throw ApiError.conflict("User with this email already exists");

//   const hashedPassword = await bcrypt.hash(password, 12);

//   const user = await User.create({
//     email,
//     password: hashedPassword,
//     name,
//     role: "user",
//   });

//   const { id, email: userEmail, name: userName, role } = user;
//   const token = generateToken({ _id: id, email: userEmail, role });

//   return {
//     token,
//     user: { id, email: userEmail, name: userName, role },
//   };
// };

// const loginUser = async ({ email, password }) => {
//   const user = await User.findOne({ email }).select("+password");
//   if (!user) throw ApiError.unauthorized("Invalid email or password");

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

//   const token = generateToken(user);

//   return {
//     token,
//     user: { id: user._id, email: user.email, name: user.name, role: user.role },
//   };
// };

// const refreshToken = async (userId) => {
//   const user = await User.findById(userId);
//   if (!user) throw ApiError.notFound("User not found");

//   const token = generateToken(user);
//   return { token };
// };

// const getCurrentUser = async (userId) => {
//   const user = await User.findById(userId).lean();
//   if (!user) throw ApiError.notFound("User not found");
//   return user;
// };

// export { registerUser, loginUser, refreshToken, getCurrentUser };
