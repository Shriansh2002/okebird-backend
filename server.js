const express = require("express");
const cors = require("cors");
const { loadEnv } = require("./config/env");
const errorHandler = require("./middlewares/errorHandler.js");
const { db } = require("./config/prisma.js");

// const userRoutes = require("./routes/users");
// const healthRoute = require("./routes/health");
// const authRoutes = require("./routes/auth");
// const sheetRoutes = require("./routes/sheets");
// const sheetContactRoutes = require("./routes/sheet-contact");

const app = express();
const PORT = loadEnv().BACKEND_PORT || 4000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("✅ Node.js Backend Running");
});

app.listen(PORT, () => {
	console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

db.$queryRaw`SELECT 1`
	.then(() => console.log("✅ Connected to database"))
	.catch((err) => {
		console.warn("⚠️  Warning: Cannot connect to database");
		console.warn("   → " + err.message);
	});

app.use(errorHandler);

// --- Graceful shutdown ---
process.on("SIGINT", async () => {
	console.log("🛑 Shutting down gracefully...");
	await db.$disconnect();
	process.exit(0);
});
