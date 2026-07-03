import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getDashboardOverview } from "../services/dashboard.service.js";

const getDashboard = asyncHandler(async (req, res) => {
  const data = await getDashboardOverview();

  return new ApiResponse(200, data, "Dashboard overview retrieved").send(res);
});

export { getDashboard };
