#!/usr/bin/env node

import { parseArgs } from "node:util";
import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import * as espree from "espree";
import { Reporter } from "./reporter.js";
import { SyntaxTreeProcessor } from "./syntax-tree-processor.js";
import { variablesRule } from "./rules/variables.js";
import { quotesRule } from "./rules/quotes.js";

function main() {
	try {
		const {
			values: {
				file: filePath,
				recommended,
				"use-single-quote": singleQuote,
				fix,
			},
		} = parseArgs({
			options: {
				file: {
					type: "string",
					short: "f",
				},
				"use-single-quote": {
					type: "boolean",
					default: false,
				},
				recommended: {
					type: "boolean",
					default: false,
				},
				fix: {
					type: "boolean",
					default: false,
				},
			},
		});

		if (!filePath) {
			throw new Error(
				"The file path is required. Pass it through the -f or --file flag",
			);
		}

		const outputFilePath = path.join(
			process.cwd(),
			`${path.basename(filePath, ".js")}.linted.js`,
		);

		const code = fs.readFileSync(filePath, "utf-8");

		const ast = espree.parse(code, {
			ecmaVersion: 2022,
			loc: true,
			sourceType: "module",
		});

		const syntaxTreeProcessor = new SyntaxTreeProcessor(filePath, {
			quotes: (nodeDeclaration) =>
				quotesRule({ singleQuote, fix, nodeDeclaration }),
			variables: (...args) =>
				variablesRule({ useConst: recommended, fix }, ...args),
		});

		const errors = syntaxTreeProcessor.process(ast, fix);

		Reporter.report({
			errors,
			ast,
			outputFilePath,
		});
	} catch (error) {
		console.error(chalk.red(error.message));
		process.exit(1);
	}
}

main();
