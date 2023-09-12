import { Router } from "express";

import authenticate from "../middlewares/auth.js";
import adminController from "../controllers/adminController.js";

const router = Router();

//?  @desc   Dashboard handle post creation
//*  @route  POST /dashboard/add-post
router.post("/add-post", authenticate, adminController.createPost);

//?  @desc   Dashboard handle post edit
//*  @route  PUT /dashboard/edit-post/:id
router.put("/edit-post/:id", authenticate, adminController.editPost);

//?  @desc   Dashboard delete post
//*  @route  DELETE /dashboard/delete-post/:id
router.delete("/delete-post/:id", authenticate, adminController.deletePost);

//?  @desc   Dashboard handle upload image
//*  @route  POST /dashboard/image-upload
router.post("/image-upload", authenticate, adminController.uploadImage);

export default router;
