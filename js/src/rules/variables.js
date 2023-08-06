export const variablesRule = (
	{ useConst, fix },
	expression,
	variables,
	stages,
	variablesKind,
) => {
	const variableName = (expression.left.object || expression.left).name;

	if (!variables.has(variableName)) {
		return `The variable ${variableName} has not been previously declared`;
	}

	const variable = variables.get(variableName);

	const { nodeDeclaration, originalKind, stage } = variable;

	if (
		useConst &&
		expression.left.type === "MemberExpression" &&
		stage === stages.declaration
	) {
		if (originalKind === variablesKind.const) return;

		if (fix) {
			nodeDeclaration.kind = variablesKind.const;

			return {
				...variable,
				name: variableName,
				stage: stages.expressionDeclaration,
				nodeDeclaration,
			};
		} else {
			return `use "const" instead ${originalKind}`;
		}
	}

	if ([nodeDeclaration.kind, originalKind].includes(variablesKind.let)) {
		return {
			...variable,
			name: variableName,
			stage: stages.expressionDeclaration,
			nodeDeclaration,
		};
	}

	if (fix) {
		nodeDeclaration.kind = variablesKind.let;

		return {
			...variable,
			name: variableName,
			stage: stages.expressionDeclaration,
			nodeDeclaration,
		};
	}

	return `use "let" instead ${originalKind}`;
};
