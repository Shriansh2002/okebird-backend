const { verifyJwt } = require("../utils/jwt");

function authMiddleware(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Unauthorized: No token provided" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = verifyJwt(token);
		req.user = decoded;

		if (process.env.NODE_ENV === "development") {
			console.log("🔐 Authenticated User:", decoded);
		}

		next();
	} catch (err) {
		console.error("JWT verification failed:", err.message);
		return res
			.status(401)
			.json({ error: "Unauthorized: Invalid or expired token" });
	}
}

module.exports = authMiddleware;
