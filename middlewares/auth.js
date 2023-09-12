import jwt from "jsonwebtoken";

const authenticated = (req, res, next) => {
	const authHeader = req.get("Authorization"); //Bearer token
	try {
		if (!auth) {
			const error = new Error("مجوز کافی ندارید");
			error.statusCode = 401;
			throw error;
		}
		const token = authHeader.split(" ")[1]; // => ["Bearer","token"] => token

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

		if (!decodedToken) {
			const error = new Error("شما وجوز کافی ندارید");
			error.statusCode = 401;
			throw error;
		}
		req.userId = decodedToken.user.userId;

		next();
	} catch (error) {
		next(error);
	}
};

export default authenticated;
