const { startOfMonth, endOfMonth } = require("date-fns");
const { db } = require("../config/prisma");
const { mapContactInput } = require("../utils/sheet");

async function createSheet({ employeeId, week, contacts }) {
	const employee = await db.user.findFirst({
		where: { id: employeeId, role: "SALES_EMPLOYEE" },
	});
	if (!employee) throw new Error("Invalid employeeId");

	const existingSheet = await db.sheet.findFirst({
		where: { employeeId, week },
	});
	if (existingSheet) throw new Error("Sheet with this week already exists");

	const sheet = await db.sheet.create({
		data: {
			employeeId,
			week,
			contacts: {
				create: contacts.map(mapContactInput),
			},
		},
		include: {
			employee: true,
			contacts: true,
		},
	});

	return sheet;
}

async function getSheetById(sheetId, user) {
	const condition = {
		id: sheetId,
		...(user.role === "SALES_EMPLOYEE" ? { employeeId: user.id } : {}),
	};

	const sheet = await db.sheet.findFirst({
		where: condition,
		include: { contacts: true },
	});

	if (!sheet) throw new Error("Sheet not found");
	return sheet;
}

async function getAllSheets({ week, employeeId }) {
	const where = {
		...(week && { week }),
		...(employeeId && { employeeId }),
	};

	return db.sheet.findMany({
		where,
		include: { employee: true },
		orderBy: { uploadedAt: "desc" },
	});
}

async function getSheetsForEmployee(employeeId) {
	return db.sheet.findMany({
		where: { employeeId },
		include: { contacts: true },
		orderBy: { uploadedAt: "desc" },
	});
}

async function getMonthlyStats(employeeId) {
	const now = new Date();

	const logs = await db.sheetContactLog.findMany({
		where: {
			action: "status",
			newValue: "completed",
			createdAt: {
				gte: startOfMonth(now),
				lte: endOfMonth(now),
			},
			updatedById: employeeId,
		},
		include: {
			sheetContact: true,
		},
	});

	const convertedCount = logs.length;
	const totalAmount = logs.reduce(
		(sum, log) => sum + (log.sheetContact.totalAmount ?? 0),
		0
	);

	const monthlySheets = await db.sheet.findMany({
		where: {
			employeeId,
			uploadedAt: {
				gte: startOfMonth(now),
				lte: endOfMonth(now),
			},
		},
		include: {
			contacts: true,
		},
	});

	const totalAssignedContacts = monthlySheets.reduce(
		(count, sheet) => count + sheet.contacts.length,
		0
	);

	const rate = 12;
	const totalCommission = (totalAmount * rate) / 100;

	return {
		converted_leads: convertedCount,
		total_commission: totalCommission,
		total_contacts_allocated: totalAssignedContacts,
	};
}

module.exports = {
	createSheet,
	getSheetById,
	getAllSheets,
	getSheetsForEmployee,
	getMonthlyStats,
};
