const parseValidationErrors = (e, req) => {
	const keys = Object.keys(e.errors);
	for (const key of keys) {
		(key: string | number) => {
			req.flash("error", `${key}: ${e.errors[key].properties.message}`);
		};
	}
};

export default parseValidationErrors;
