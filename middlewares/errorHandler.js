const { Prisma } = require("@prisma/client");

module.exports = function errorHandler(err, req, res, next) {
	console.error("🔥 Error:", err);

	if (process.env.NODE_ENV === "development") {
		console.log("📍", req.method, req.originalUrl);
	}

	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		switch (err.code) {
			case "P2002":
				return res
					.status(409)
					.json({ error: "Duplicate entry", code: "P2002", detail: err.meta });
			case "P2025":
				return res
					.status(404)
					.json({ error: "Record not found", code: "P2025", detail: err.meta });
			default:
				return res
					.status(500)
					.json({ error: "Database error", code: err.code });
		}
	}

	if (err.message?.includes("Can't reach database server")) {
		return res.status(503).json({
			error: "Database is unavailable",
			code: "DB_UNREACHABLE",
			message:
				process.env.NODE_ENV === "development"
					? "Is Postgres running on port 5432?"
					: "Service temporarily unavailable",
		});
	}

	if (err.message === "Invalid email or password") {
		return res.status(401).json({ error: "Unauthorized: Invalid credentials" });
	}

	res.status(500).json({
		error: "Internal Server Error",
		code: "INTERNAL_ERROR",
		detail: process.env.NODE_ENV === "development" ? err.message : undefined,
	});
};
