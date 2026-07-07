import rateLimit from "express-rate-limit";

// ==========================================
// Rate Limiters — MVP: Only apiLimiter active
// ==========================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// ==========================================
// FUTURE PHASE
// Auth & Deployment Limiters
// ==========================================

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: "Too many auth attempts, please try again later.",
//   },
// });

// const deploymentLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 50,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: {
//     success: false,
//     message: "Too many deployment requests, please try again later.",
//   },
// });

export { apiLimiter };
// export { apiLimiter, authLimiter, deploymentLimiter };
