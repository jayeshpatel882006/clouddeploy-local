// ==========================================
// FUTURE PHASE
// Floci Module
// ==========================================

// import { Router } from "express";
// import {
//   getBuckets,
//   addBucket,
//   getObjects,
//   getFunctions,
//   runFunction,
//   getUsers,
//   addUser,
//   getTopics,
//   publishMessage,
//   getQueues,
//   postMessage,
// } from "../controllers/floci.controller.js";
// import { authenticate, authorize } from "../middleware/auth.js";

// const router = Router();

// router.use(authenticate);

// /* ─── S3 ─────────────────────────────────────────── */
// router.get("/s3/buckets", getBuckets);
// router.post("/s3/buckets", authorize("admin"), addBucket);
// router.get("/s3/buckets/:bucketName/objects", getObjects);

// /* ─── Lambda ─────────────────────────────────────── */
// router.get("/lambda/functions", getFunctions);
// router.post("/lambda/functions/:functionName/invoke", runFunction);

// /* ─── IAM ────────────────────────────────────────── */
// router.get("/iam/users", getUsers);
// router.post("/iam/users", authorize("admin"), addUser);

// /* ─── SNS ────────────────────────────────────────── */
// router.get("/sns/topics", getTopics);
// router.post("/sns/publish", publishMessage);

// /* ─── SQS ────────────────────────────────────────── */
// router.get("/sqs/queues", getQueues);
// router.post("/sqs/send", postMessage);

// export default router;
