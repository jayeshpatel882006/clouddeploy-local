import { Router } from "express";
import { deleteController } from "../controllers/delete.controller.js";

const router = Router();

router.delete("/", deleteController);

export default router;
