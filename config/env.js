const path = require("path");
const dotenv = require("dotenv");

function loadEnv() {
	dotenv.config({ path: path.resolve(__dirname, "../.env") });

	if (!process.env.DATABASE_URL) {
		console.error("❌ DATABASE_URL is missing in .env");
		process.exit(1);
	}

	return process.env;
}

module.exports = { loadEnv };
