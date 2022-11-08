import { Router } from "express";
import TaskController from "../controllers/taskController";
import checkAuth from "../middlewares/chechAuth.js";

const router = Router();

router.post("/create", checkAuth, (req, res) =>
  TaskController.createTask(req, res)
);

router.get("/", checkAuth, (req, res) => TaskController.getTasks(req, res));

router.put("/update/:id", checkAuth, (req, res) =>
  TaskController.updateTask(req, res)
);

router.delete("/delete/:id", checkAuth, (req, res) =>
  TaskController.deleteTask(req, res)
);

export default router;
