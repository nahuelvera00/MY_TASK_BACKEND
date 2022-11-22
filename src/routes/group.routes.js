import { Router } from "express";
import GroupController from "../controllers/groupController";
import checkAuth from "../middlewares/chechAuth";

const router = Router();

router.post("/create", checkAuth, (req, res) =>
  GroupController.createGroup(req, res)
);

router.get("/", checkAuth, (req, res) => GroupController.getGroups(req, res));

router.post("/:group/add-member", checkAuth, (req, res) =>
  GroupController.addMember(req, res)
);

router.delete("/:group/delete-member", checkAuth, (req, res) =>
  GroupController.deleteMember(req, res)
);

router.post("/:group/add-task", checkAuth, (req, res) =>
  GroupController.addTask(req, res)
);

router.put("/:group/update-task/:task", checkAuth, (req, res) =>
  GroupController.updateTask(req, res)
);

export default router;
