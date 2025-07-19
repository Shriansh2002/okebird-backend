function validateCreateSheetPayload({ employeeId, week, contacts }) {
	if (
		!employeeId ||
		!week ||
		!Array.isArray(contacts) ||
		contacts.length === 0
	) {
		return "Missing or invalid payload fields";
	}
	if (!contacts.every((c) => c.name && c.phone)) {
		return "Each contact must have at least name and phone";
	}
	return null;
}

function mapContactInput(contact) {
	return {
		name: contact.name,
		address: contact.address || null,
		category: contact.category || null,
		website: contact.website || null,
		phone: contact.phone,
	};
}

module.exports = { validateCreateSheetPayload, mapContactInput };
