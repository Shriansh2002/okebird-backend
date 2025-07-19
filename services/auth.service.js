const { signJwt } = require("../utils/jwt");

const bcrypt = require("bcrypt");
const { db } = require("../config/prisma");

async function loginUser({ email, password }) {
	const user = await db.user.findUnique({ where: { email } });

	if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
		throw new Error("Invalid email or password");
	}

	const token = signJwt({
		id: user.id,
		role: user.role,
		email: user.email,
	});

	return {
		token,
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
		},
	};
}

async function registerUser({ email, name, password, role }) {
	const existing = await db.user.findUnique({ where: { email } });
	if (existing) {
		throw new Error("Email already exists");
	}

	const passwordHash = await bcrypt.hash(password, 10);

	const user = await db.user.create({
		data: {
			email,
			name,
			role,
			passwordHash,
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
