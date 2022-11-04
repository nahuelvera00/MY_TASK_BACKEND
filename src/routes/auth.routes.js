import { Router } from "express";
import AuthController from "../controllers/authController.js";

const router = Router();

router.post("/", (req, res) => AuthController.register(req, res));
router.get("/confirm/:token", (req, res) =>
  AuthController.confirmAccount(req, res)
);
router.post("/login", (req, res) => AuthController.auth(req, res));
router.post("/recover-password", (req, res) =>
  AuthController.recoverPassword(req, res)
);

router
  .route("/recover-password/:token")
  .get((req, res) => AuthController.checkToken(req, res))
  .post((req, res) => AuthController.newPassword(req, res));
export default router;
