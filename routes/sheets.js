const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const auth = require("../middlewares/auth");
const { requireAdmin, requireEmployee } = require("../middlewares/roles");
const { validateCreateSheetPayload } = require("../utils/sheet");
const sheetsService = require("../services/sheets.service");

const router = express.Router();

// POST /sheets - Admin creates a new sheet for an employee
router.post(
	"/",
	auth,
	requireAdmin,
	asyncHandler(async (req, res) => {
		const { employeeId, week, contacts } = req.body;

		const validationError = validateCreateSheetPayload({
			employeeId,
			week,
			contacts,
		});
		if (validationError)
			return res.status(400).json({ error: validationError });

		try {
			const sheet = await sheetsService.createSheet({
				employeeId,
				week,
				contacts,
			});
			res.status(201).json(sheet);
		} catch (err) {
			res.status(400).json({ error: err.message });
		}
	})
);

// GET /sheets/mine - Employee gets their own sheets
router.get(
	"/mine",
	auth,
	requireEmployee,
	asyncHandler(async (req, res) => {
		const sheets = await sheetsService.getSheetsForEmployee(req.user.id);
		res.json(sheets);
	})
);

router.get(
	"/:id",
	auth,
	asyncHandler(async (req, res) => {
		try {
			const sheet = await sheetsService.getSheetById(req.params.id, req.user);
			res.json(sheet);
		} catch (err) {
			res.status(404).json({ error: err.message });
		}
	})
);

// GET /sheets - Admin fetches all sheets (with optional week, employeeId)
router.get(
	"/",
	auth,
	requireAdmin,
	asyncHandler(async (req, res) => {
		const { week, employeeId } = req.query;
		const sheets = await sheetsService.getAllSheets({ week, employeeId });
		res.json(sheets);
	})
);

module.exports = router;
