export class SyntaxTreeProcessor {
	#filePath;
	#rules;
	#errors = new Map();
	#variables = new Map();
	#stages = {
		declaration: "declaration",
		expressionDeclaration: "expressionDeclaration",
	};
	#variablesKind = {
		const: "const",
		let: "let",
		var: "var",
	};

	constructor(filePath, rules) {
		this.#filePath = filePath;
		this.#rules = rules;
	}

	#storeError(message, { line, column }) {
		const errorLocation = `${this.#filePath}:${line}:${column + 1}`;

		this.#errors.set(errorLocation, { message, errorLocation });
	}

	#handleLiteralDeclarations(nodeDeclaration) {
		if (nodeDeclaration.raw && typeof nodeDeclaration.raw === "string") {
			const message = this.#rules.quotes(nodeDeclaration);

			if (!message) return;

			this.#storeError(message, nodeDeclaration.loc.start);
		}
	}

	#handleVariableDeclarations(nodeDeclaration) {
		const originalKind = nodeDeclaration.kind;
		for (const declaration of nodeDeclaration.declarations) {
			this.#variables.set(declaration.id.name, {
				originalKind,
				stage: this.#stages.declaration,
				nodeDeclaration,
			});
		}
	}

	#handleExpressionStatements(nodeDeclaration) {
		const { expression } = nodeDeclaration;

		if (
			expression.left?.type === "Identifier" ||
			expression.left?.type === "MemberExpression"
		) {
			const result = this.#rules.variables(
				expression,
				this.#variables,
				this.#stages,
				this.#variablesKind,
			);

			if (!result) return;

			if (typeof result === "string") {
				this.#storeError(result, expression.loc.start);
				return;
			}

			this.#variables.set(result.name, result);
		}
	}

	#traverse(nodeDeclaration) {
		const hooks = {
			Literal: (node) => this.#handleLiteralDeclarations(node),
			VariableDeclaration: (node) => this.#handleVariableDeclarations(node),
			ExpressionStatement: (node) => this.#handleExpressionStatements(node),
		};

		hooks[nodeDeclaration?.type]?.(nodeDeclaration);

		for (const key in nodeDeclaration) {
			if (typeof nodeDeclaration[key] !== "object") continue;

			this.#traverse(nodeDeclaration[key]);
		}
	}

	#checkDeclarationsThatNeverChanged(fix) {
		const variables = [...this.#variables.values()];

		variables
			.filter(({ stage, nodeDeclaration }) => {
				return (
					stage === this.#stages.declaration &&
					nodeDeclaration.kind !== this.#variablesKind.const
				);
			})
			.forEach(({ nodeDeclaration }) => {
				if (fix) {
					nodeDeclaration.kind = "const";
					return;
				}

				return `use "const" instead ${nodeDeclaration.kind}`;
			});
	}

	process(ast, fix) {
		this.#traverse(ast);
		this.#checkDeclarationsThatNeverChanged(fix);

		return [...this.#errors.values()];
	}
}
