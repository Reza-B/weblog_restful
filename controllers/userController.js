import Bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export default class userController {
	// Login page POST controller -- login User
	static handleLogin = async (req, res, next) => {
		const { email, password } = req.body;
		try {
			const user = await User.findOne({ email });
			if (!user) {
				const error = new Error("آدرس ایمیل یا کلمه عبور اشتباه است");
				error.statusCode = 422;
				throw error;
			}
			const isEqual = await Bcrypt.compare(password, user.password);

			if (isEqual) {
				const token = jwt.sign(
					{
						user: {
							userId: user._id.toString(),
							email: user.email,
							fullname: user.fullname,
						},
					},
					process.env.JWT_SECRET,
				);
				res.status(200).json({ token, userId: user._id.toString() });
			} else {
				const error = new Error("آدرس ایمیل یا کلمه عبور اشتباه است");
				error.statusCode = 422;
				throw error;
			}
		} catch (error) {
			next(error);
		}
	};

	// Register page POST controller -- Create User
	static createUser = async (req, res, next) => {
		try {
			// User validation
			await User.userValidation(req.body);
			const { fullname, email, password } = req.body;

			// User email validation
			const user = await User.findOne({ email });
			if (user) {
				const error = new Error("کاربری با این ایمیل در پایگاه داده موجود است");
				error.statusCode = 422;
				throw error;
			} else {
				//Generate password hash
				const passHash = await Bcrypt.hash(password);

				//Create User and redirect to login page
				await User.create({
					fullname,
					email,
					password: passHash,
				});

				res.status(201).json({ message: "عضویت موفقیت آمیز بود" });
			}
		} catch (err) {
			next(err);
		}
	};

	static handleForgetPassword = async (req, res, next) => {
		const { email } = req.body;
		try {
			const user = await User.findOne({ email });
			if (!user) {
				const error = new Error("کاربری با این ایمیل یافت نشد.");
				error.statusCode = 404;
				throw error;
			}
			const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

			const resetLink = `http://localhost:5000/users/rest-password/${token}`;

			//TODO send reset link with email
			//? for test send link in json response

			res.status(200).json({ message: resetLink });
		} catch (error) {
			next(error);
		}
	};

	static handleResetPassword = async (req, res, next) => {
		const token = req.params.token;
		const { password, confirmPassword } = req.body;

		try {
			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
			if (!decodedToken) {
				const error = new Error("شما مجوز این عملیات را ندارید");
				error.statusCode = 401;
				throw error;
			}

			if (password !== confirmPassword) {
				const error = new Error("کلمه های عبور یکسان نمیباشند");
				error.statusCode = 422;
				throw error;
			}

			const user = await User.findOne({ _id: decodedToken.userId });

			if (!user) {
				const error = new Error("کاربر مورد نظر یافت نشد");
				error.statusCode = 404;
				throw error;
			}
			user.password = password;
			await user.save();

			res.status(200).json({ message: "عملیات با موفقیت انجام شد" });
		} catch (error) {
			next(error);
		}
	};
}
