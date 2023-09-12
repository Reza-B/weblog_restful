import { unlink } from "fs";

import multer from "multer";
import sharp from "sharp";
import shortId from "short-unique-id";
import appRoot from "app-root-path";

import Blog from "../models/blog.js";

export default class adminController {
	// Add post page POST controller -- Create Post
	static createPost = async (req, res, next) => {
		const uid = new shortId({
			length: 7,
		});
		const thumbnail = req.files ? req.files.thumbnail : {};
		const fileName = `${uid()}_${thumbnail.name}`;
		const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;
		try {
			req.body = { ...req.body, thumbnail };
			await Blog.postValidation(req.body);
			await sharp(req.files.thumbnail.data)
				.jpeg({ quality: 60 })
				.toFile(uploadPath);
			await Blog.create({
				...req.body,
				user: req.user.id,
				thumbnail: fileName,
			});
			res.status(201).json({ message: "پست جدید با موفقیت ساخته شد" });
		} catch (error) {
			next(error);
		}
	};
	// Handle Edit post PUT controller -- Edit Post
	static editPost = async (req, res, next) => {
		const uid = new shortId({ length: 7 });
		const thumbnail = req.files ? req.files.thumbnail : {};
		const fileName = `${uid()}_${thumbnail.name}`;
		const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;
		try {
			const post = await Blog.findById(req.params.id);
			if (thumbnail.name) {
				await Blog.postValidation({ ...req.body, thumbnail });
			} else {
				await Blog.postValidation({
					...req.body,
					thumbnail: { name: "placeholder", size: 0, mimetype: "image/jpeg" },
				});
			}
			//? Access validation
			if (!post) {
				const error = new Error("پست یافت نشد");
				error.statusCode = 404;
				throw error;
			}
			if (post.user.toString() != req.userId) {
				const error = new Error("شما مجوز ویرایش این پست را ندارید");
				error.statusCode = 401;
				throw error;
			} else {
				if (thumbnail.name) {
					unlink(
						`${appRoot}/public/uploads/tumbnails/${post.thumbnail}`,
						async (err) => {
							if (err) {
								console.log(err);
							} else {
								await sharp(req.files.thumbnail.data)
									.jpeg({ quality: 60 })
									.toFile(uploadPath);
							}
						},
					);
				}
				//? Edit parameters
				const { title, status, body } = req.body;
				post.title = title;
				post.status = status;
				post.body = body;
				post.thumbnail = thumbnail.name ? fileName : post.thumbnail;
				await post.save();
			}
			res.status(200).json({ message: "پست شما با موفقیت ویرایش شد" });
		} catch (error) {
			next(error);
		}
	};
	// handle delete Delete controller -- Delete Post
	static deletePost = async (req, res, next) => {
		const filePath = `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`;
		try {
			//delete post
			const post = await Blog.findByIdAndRemove(req.params.id);
			//delete thumbnail
			unlink(filePath, (err) => {
				if (err) {
					const error = new Error("خطایی در پاکسازی عکس پست رخ داده است");
					error.statusCode = 400;
					throw error;
				} else {
					res.status(200).json({ message: "پست شما با موفقیت حذف شد" });
				}
			});
		} catch (error) {
			next(error);
		}
	};
	// Handle Uploade image
	static uploadImage = (req, res, next) => {
		try {
			const fileFilter = (req, file, cb) => {
				if (file.mimetype === "image/jpeg") {
					cb(null, true);
				} else {
					cb("تنها پسوند JPEG پشتیبانی میشود", false);
				}
			};

			const upload = multer({
				limits: { fileSize: 4000000 },
				fileFilter: fileFilter,
			}).single("image");

			upload(req, res, async (err) => {
				if (error) {
					if (error.code === "LIMIT_FILE_SIZE") {
						return res
							.status(422)
							.json({ error: "حجم عکس ارسالی نباید بیشتر از 2 مگابایت باشد!" });
					}
					res.status(400).json({ error });
				} else {
					if (req.files) {
						const uid = new shortId({
							length: 7,
						});
						const fileName = `${uid()}_${req.files.image.name}`;
						try {
							await sharp(req.files.image.data)
								.jpeg({
									quality: 60,
								})
								.toFile(`./public/uploads/${fileName}`);
							res
								.status(200)
								.json({ image: `http://localhost:3000/uploads/${fileName}` });
						} catch (error) {
							res
								.status(500)
								.json({ error: "در هنگام آپلود عکس خطایی رخ داد." });
						}
					} else {
						res.status(400).json({ error: "جهت آپلود باید عکسی انتخاب کنید" });
					}
				}
			});
		} catch (error) {
			next(error);
		}
	};
}
