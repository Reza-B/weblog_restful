import { object, string } from "yup";
import captchapng from "captchapng";

import Blog from "../models/blog.js";

export class BlogController {
	// Get all posts
	static getAll = async (req, res, next) => {
		try {
			const total = await Blog.find({
				status: "public",
			}).countDocuments();

			const posts = await Blog.find({ status: "public" }).sort({
				createdAt: "desc",
			});

			if (!posts) {
				const err = new Error("هیچ پستی در پایگاه داده ثبت نشده است");
				err.status = 404;
				throw err;
			}
			res.status(200).json({ posts, total });
		} catch (error) {
			next(error);
		}
	};

	// Get single post
	static getPost = async (req, res, next) => {
		try {
			const post = await Blog.findById(req.params.id).populate("user");
			if (!post) {
				const err = new Error("پست یافت نشد");
				err.status(404);
				throw err;
			}
			res.status(200).json({ post });
		} catch (error) {
			next(error);
		}
	};

	// Handle contact us page
	static handleContact = async (req, res, next) => {
		const errors = [];

		const schema = object().shape({
			fullname: string().required("نام و نام خانوادگی الزامی می باشد"),
			email: string()
				.email("آدرس ایمیل معتبر نیست")
				.required("آدرس ایمیل الزامی می باشد"),
			message: string().required("پیام اصلی الزامی می باشد"),
		});

		try {
			await schema.validate(req.body, { abortEarly: false });

			//TODO create send email function
			console.log(`send email ${req.body.name} ${req.body.email}`);

			return res.status(200).json({ message: "success" });
		} catch (err) {
			err.inner.forEach((e) => {
				errors.push({
					name: e.path,
					message: e.message,
				});
			});

			w;
			const error = new Error("خطا در اعتبار سنجی");
			error.statusCode = 422;
			error.data = errors;

			next(error);
		}
	};
}
