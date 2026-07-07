// ==========================================
// FUTURE PHASE
// Validate Middleware
// ==========================================

// import ApiError from "../utils/ApiError.js";

// const validate = (rules) => {
//   return (req, res, next) => {
//     const errors = [];

//     for (const [field, options] of Object.entries(rules)) {
//       const value = req.body[field];

//       if (options.required && (value === undefined || value === null || value === "")) {
//         errors.push(options.message || `${field} is required`);
//         continue;
//       }

//       if (value !== undefined && value !== null) {
//         if (options.type === "string" && typeof value !== "string") {
//           errors.push(`${field} must be a string`);
//         }
//         if (options.type === "number" && (typeof value !== "number" || isNaN(value))) {
//           errors.push(`${field} must be a number`);
//         }
//         if (options.minLength && typeof value === "string" && value.length < options.minLength) {
//           errors.push(`${field} must be at least ${options.minLength} characters`);
//         }
//         if (options.maxLength && typeof value === "string" && value.length > options.maxLength) {
//           errors.push(`${field} must be at most ${options.maxLength} characters`);
//         }
//         if (options.min !== undefined && Number(value) < options.min) {
//           errors.push(`${field} must be at least ${options.min}`);
//         }
//         if (options.max !== undefined && Number(value) > options.max) {
//           errors.push(`${field} must be at most ${options.max}`);
//         }
//         if (options.enum && !options.enum.includes(value)) {
//           errors.push(`${field} must be one of: ${options.enum.join(", ")}`);
//         }
//       }
//     }

//     if (errors.length > 0) {
//       return next(ApiError.badRequest("Validation failed", errors));
//     }

//     next();
//   };
// };

// export default validate;
