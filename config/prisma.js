const { PrismaClient } = require("@prisma/client");

let prisma;

try {
	prisma = new PrismaClient({
		log: ["query", "warn", "error"],
	});
} catch (error) {
	console.error("❌ Failed to initialize Prisma Client:", error.message);
	process.exit(1);
}

module.exports = {
	db: prisma,
};
