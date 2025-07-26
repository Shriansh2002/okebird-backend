const { signJwt } = require("../utils/jwt");

// const bcrypt = require("bcrypt");
const { db } = require("../config/prisma");

async function loginUser({ email, password }) {
	const user = await db.user.findUnique({ where: { email } });

	if (!user || password !== user.passwordHash || !user.active) {
		throw new Error("Invalid email or password");
	}

	const token = signJwt({
		id: user.id,
		role: user.role,
		email: user.email,
		userName: user.name,
	});

	return {
		token,
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
			userName: user.name,
		},
	};
}

async function registerUser({ email, name, password, role }) {
	const existing = await db.user.findUnique({ where: { email } });
	if (existing) {
		throw new Error("Email already exists");
	}

	// const passwordHash = await bcrypt.hash(password, 10);

	const user = await db.user.create({
		data: {
			email,
			name,
			role,
			passwordHash: password,
		},
		select: {
			id: true,
			email: true,
			name: true,
			role: true,
			createdAt: true,
		},
	});

	return user;
}

module.exports = { loginUser, registerUser };
