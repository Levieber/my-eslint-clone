import chalk from "chalk";
import * as astring from "astring";
import fs from "node:fs";
import path from "node:path";

export class Reporter {
	static report({ errors, ast, outputFilePath }) {
		errors
			.sort((error1, error2) => {
				const [aLine, aColumn] = error1.errorLocation.split(":").slice(1);
				const [bLine, bColumn] = error2.errorLocation.split(":").slice(1);

				if (aLine === bLine) return aColumn - bColumn;

				return aLine - bLine;
			})
			.forEach(({ message, errorLocation }) => {
				const errorMessage = `${chalk.red("Error:")} ${message}`;
				const finalMessage = `\n${errorMessage}\n${chalk.gray(errorLocation)}`;
				console.error(finalMessage);
			});

		const updatedCode = astring.generate(ast);
		fs.writeFileSync(outputFilePath, updatedCode, "utf-8");

		if (errors.length === 0) {
			console.log(chalk.green("\nLint completed without errors!"));
		} else {
			console.error(
				chalk.red(`\nLint completed with ${errors.length} error(s)!`),
			);
		}

		console.log(
			chalk.green("\nCode fixed and saved at"),
			chalk.yellow(`./${path.basename(outputFilePath)}`),
			chalk.green("successfully!"),
		);
	}
}
