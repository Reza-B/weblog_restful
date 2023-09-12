const setHeaders = (req, res, next) => {
	res.setHeader("Access-Control-Allow-Orgin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); //Crud
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
};

export default setHeaders;
