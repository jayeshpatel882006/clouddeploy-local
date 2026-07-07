// ==========================================
// FUTURE PHASE
// Auth Controller
// ==========================================

// import asyncHandler from "../utils/asyncHandler.js";
// import ApiResponse from "../utils/ApiResponse.js";
// import {
//   registerUser,
//   loginUser,
//   refreshToken,
//   getCurrentUser,
// } from "../services/auth.service.js";

// const register = asyncHandler(async (req, res) => {
//   const result = await registerUser(req.body);
//   return new ApiResponse(201, result, "User registered successfully").send(res);
// });

// const login = asyncHandler(async (req, res) => {
//   const result = await loginUser(req.body);
//   return new ApiResponse(200, result, "Login successful").send(res);
// });

// const refresh = asyncHandler(async (req, res) => {
//   const { id } = req.user;
//   const result = await refreshToken(id);
//   return new ApiResponse(200, result, "Token refreshed").send(res);
// });

// const me = asyncHandler(async (req, res) => {
//   const result = await getCurrentUser(req.user.id);
//   return new ApiResponse(200, result, "User retrieved").send(res);
// });

// export { register, login, refresh, me };
