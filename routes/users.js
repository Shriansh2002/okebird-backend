const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { db } = require("../config/prisma");
const auth = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/roles");

const router = express.Router();

router.get(
	"/",
	auth,
	requireAdmin,
	asyncHandler(async (req, res) => {
		const users = await db.user.findMany({
			where: {
				role: "SALES_EMPLOYEE",
			},
		});
		res.json(users);
	})
);

router.get(
	"/all",
	auth,
	requireAdmin,
	asyncHandler(async (req, res) => {
		const users = await db.user.findMany();
		res.json(users);
	})
);

module.exports = router;
