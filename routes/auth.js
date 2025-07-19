const express = require("express");
const { loginUser, registerUser } = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const auth = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/roles");
const { db } = require("../config/prisma");
const { ALL_ROLES } = require("../utils/constants");

const router = express.Router();

// POST /auth/login
router.post(
	"/login",
	asyncHandler(async (req, res) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		const result = await loginUser({ email, password });

		res.json(result); // { token, user }
	})
);

// POST /auth/register
router.post(
	"/register",
	auth,
	requireAdmin,
	asyncHandler(async (req, res) => {
		const { email, name, password, role } = req.body;

		if (!email || !password || !role) {
			return res
				.status(400)
				.json({ error: "Email, password and role are required" });
		}

		if (!ALL_ROLES.includes(role))
			return res.status(400).json({ error: "Invalid role" });

		const existing = await db.user.findUnique({ where: { email } });
		if (existing) {
			return res.status(409).json({ error: "Email already exists" });
		}

		const user = await registerUser({ email, name, password, role });

		res.status(201).json(user);
	})
);

module.exports = router;
