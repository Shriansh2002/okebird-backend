const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { db } = require("../config/prisma");

const router = express.Router();

router.get(
	"/",
	asyncHandler(async (req, res) => {
		await db.$queryRaw`SELECT 1`; // ping DB
		res.json({ status: "ok", db: true });
	})
);

module.exports = router;
