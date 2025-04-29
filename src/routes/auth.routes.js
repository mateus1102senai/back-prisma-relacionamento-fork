import express from "express";
import AuthController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login); // Rota para login de usuário

export default authRouter;