import express from "express";
import { login, signup } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/auth.js";
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);

router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "Protected route", user: req.user });
});

export default router;
