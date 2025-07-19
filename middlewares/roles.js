function requireAdmin(req, res, next) {
	if (!req.user || req.user.role !== "ADMIN") {
		return res.status(403).json({ error: "Forbidden: Admins only" });
	}
	next();
}

function requireEmployee(req, res, next) {
	if (!req.user || req.user.role !== "SALES_EMPLOYEE") {
		return res.status(403).json({ error: "Forbidden: Employees only" });
	}
	next();
}

module.exports = {
	requireAdmin,
	requireEmployee,
};
