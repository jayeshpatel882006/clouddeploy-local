import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  listBuckets,
  createBucket,
  listObjects,
  listFunctions,
  invokeFunction,
  listUsers,
  createUser,
  listTopics,
  publishToTopic,
  listQueues,
  sendMessage,
} from "../engine/floci.engine.js";

/* S3 */
const getBuckets = asyncHandler(async (req, res) => {
  const result = await listBuckets();
  return new ApiResponse(200, result, "Buckets retrieved").send(res);
});

const addBucket = asyncHandler(async (req, res) => {
  const { bucketName } = req.body;
  const result = await createBucket(bucketName);
  return new ApiResponse(201, result, "Bucket created").send(res);
});

const getObjects = asyncHandler(async (req, res) => {
  const { bucketName } = req.params;
  const result = await listObjects(bucketName);
  return new ApiResponse(200, result, "Objects retrieved").send(res);
});

/* Lambda */
const getFunctions = asyncHandler(async (req, res) => {
  const result = await listFunctions();
  return new ApiResponse(200, result, "Functions retrieved").send(res);
});

const runFunction = asyncHandler(async (req, res) => {
  const { functionName } = req.params;
  const result = await invokeFunction(functionName, req.body);
  return new ApiResponse(200, result, "Function invoked").send(res);
});

/* IAM */
const getUsers = asyncHandler(async (req, res) => {
  const result = await listUsers();
  return new ApiResponse(200, result, "Users retrieved").send(res);
});

const addUser = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const result = await createUser(username);
  return new ApiResponse(201, result, "User created").send(res);
});

/* SNS */
const getTopics = asyncHandler(async (req, res) => {
  const result = await listTopics();
  return new ApiResponse(200, result, "Topics retrieved").send(res);
});

const publishMessage = asyncHandler(async (req, res) => {
  const { topicArn, message } = req.body;
  const result = await publishToTopic(topicArn, message);
  return new ApiResponse(200, result, "Message published").send(res);
});

/* SQS */
const getQueues = asyncHandler(async (req, res) => {
  const result = await listQueues();
  return new ApiResponse(200, result, "Queues retrieved").send(res);
});

const postMessage = asyncHandler(async (req, res) => {
  const { queueUrl, messageBody } = req.body;
  const result = await sendMessage(queueUrl, messageBody);
  return new ApiResponse(200, result, "Message sent").send(res);
});

export {
  getBuckets,
  addBucket,
  getObjects,
  getFunctions,
  runFunction,
  getUsers,
  addUser,
  getTopics,
  publishMessage,
  getQueues,
  postMessage,
};
