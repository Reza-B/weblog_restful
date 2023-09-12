import path from "path";

import express from "express";
import dotenv from "dotenv";
import fileupload from "express-fileupload";

import connectDB from "./config/db.js";
import blogRoutes from "./routes/blog.js";
import dashRoutes from "./routes/dashboard.js";
import userRoutes from "./routes/user.js";
import errorHandler from "./middlewares/errors.js";
import setHeaders from "./middlewares/headers.js";

const __dirname = path.resolve();

//* Load config
dotenv.config({ path: "./config/config.env" });

//* Database connection
connectDB();

const app = express();

//* BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(setHeaders);

//* File Upload middleware
app.use(fileupload());

//* Static Folder
app.use(express.static(path.join(__dirname, "public")));

//* Routes
app.use(blogRoutes);
app.use("/dashboard", dashRoutes);
app.use("/users", userRoutes);

//* Error controller
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
