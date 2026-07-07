import { deleteApplication } from "../services/delete.service.js";

export const deleteController = async (req, res, next) => {
  try {
    const result = await deleteApplication(req.body);

    res.json(result);
  } catch (error) {
    next(error);
  }
};
