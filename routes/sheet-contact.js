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
		if (!body) {
			return res.status(400).json({ error: "Missing request body" });
		}

		const { status } = body;
		const userId = req.user.id;

		const validStatuses = Object.values(ContactStatus).filter(
			(status) => status !== "completed"
		);

		if (!validStatuses.includes(status)) {
			return res.status(400).json({ error: "Invalid status value" });
		}

		try {
			const updatedContact = await db.$transaction(async (prisma) => {
				const existingContact = await prisma.sheetContact.findUniqueOrThrow({
					where: { id: contactId },
					select: { status: true },
				});

				return prisma.sheetContact.update({
					where: { id: contactId },
					data: {
						status,
						updatedById: userId,
						updatedAt: new Date(),
						logs: {
							create: {
								updatedById: userId,
								action: `status changed`,
								oldValue: existingContact.status,
								newValue: status,
							},
						},
					},
				});
			});

			res.json({ success: true, contact: updatedContact });
		} catch (error) {
			// This will now catch "findUniqueOrThrow" errors too
			if (error.code === "P2025") {
				return res.status(404).json({ error: "Contact not found" });
			}
			console.error("Failed to update contact status:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	})
);

module.exports = router;
