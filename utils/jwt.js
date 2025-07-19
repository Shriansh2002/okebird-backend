const jwt = require("jsonwebtoken");
const { loadEnv } = require("../config/env");

const JWT_SECRET = loadEnv().JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = "7d";

/**
 * Sign JWT for a user payload
 */
function signJwt(payload, options = {}) {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
		...options,
	});
}

/**
 * Verify and decode JWT
 */
function verifyJwt(token) {
	return jwt.verify(token, JWT_SECRET);
}

module.exports = {
	signJwt,
	verifyJwt,
};
