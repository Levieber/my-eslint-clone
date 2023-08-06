export const quotesRule = ({ singleQuote, fix, nodeDeclaration }) => {
	if (singleQuote) {
		const regex = /"/g;

		if (fix) {
			nodeDeclaration.raw = nodeDeclaration.raw.replace(regex, "'");
			return null;
		}

		return regex.test(nodeDeclaration.raw)
			? "use single quotes instead double quotes"
			: null;
	} else {
		const regex = /'/g;

		if (fix) {
			nodeDeclaration.raw = nodeDeclaration.raw.replace(regex, '"');
			return null;
		}

		return regex.test(nodeDeclaration.raw)
			? "use double quotes instead single quotes"
			: null;
	}
};
