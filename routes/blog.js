import { Router } from "express";
import { BlogController } from "../controllers/blogController.js";

const router = Router();

//?  @desc   Weblog Index Page
//*  @route  GET /
router.get("/", BlogController.getAll);

//?  @desc   Weblog Post Page
//*  @route  GET /post/:id
router.get("/post/:id", BlogController.getPost);

//?  @desc   Handle Contact Us Page
//*  @route  POST /contact
router.post("/contact", BlogController.handleContact);

export default router;
