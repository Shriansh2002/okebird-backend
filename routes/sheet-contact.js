const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const auth = require("../middlewares/auth");
const { requireEmployee } = require("../middlewares/roles");
const { db } = require("../config/prisma");
const { ContactStatus } = require("@prisma/client");

const router = express.Router();

// Update a sheet-contact

router.patch(
	"/:id/status",
	auth,
	requireEmployee,
	asyncHandler(async (req, res) => {
		const contactId = req.params.id;
		const body = req.body;
		if (!req.body.status) {
			return res.status(400).json({ error: "Status is required" });
		}
		const { status } = body;
		const userId = req.user.id;

		const validStatuses = Object.values(ContactStatus).filter(
			(status) => status !== "completed"
		);

		if (!validStatuses.includes(status)) {
			return res.status(400).json({ error: "Invalid status value" });
		}

		const contact = await db.sheetContact.findUnique({
			where: { id: contactId },
		});

		if (!contact) {
			return res.status(404).json({ error: "Contact not found" });
		}

		const oldStatus = contact.status;

		const updatedContact = await db.sheetContact.update({
			where: { id: contactId },
			data: {
				status,
				updatedById: userId,
				updatedAt: new Date(),
			},
		});

		// Create log entry
		await db.sheetContactLog.create({
			data: {
				sheetContactId: contactId,
				updatedById: userId,
				action: "status",
				oldValue: oldStatus,
				newValue: status,
			},
		});

		return res.json(updatedContact);
	})
);

module.exports = router;
