import { Router } from "express";

import userController from "../controllers/userController.js";

const router = Router();

//POST - handle Register
router.post("/register", userController.createUser);

//POST - Handle Login
router.post("/login", userController.handleLogin);

//POST - Handle Forget password
router.post("/forget-passwoed", userController.handleForgetPassword);

//POST - Handle Reset password
router.post("/reset-password/:token", userController.handleResetPassword);

export default router;
