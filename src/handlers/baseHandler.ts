import * as vscode from 'vscode';
import { execSync, spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export abstract class BaseHandler {
	abstract commandId: string;
	abstract name: string;

	constructor(protected outputChannel: vscode.OutputChannel) {}

	abstract async execute(): Promise<void>;

	protected log(message: string) {
		const timestamp = new Date().toLocaleTimeString();
		this.outputChannel.appendLine(`[${timestamp}] ${message}`);
	}

	protected async executeC(args: string[]): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const executable = path.join(__dirname, '..', '..', 'bin', 'hoxkey-core.exe');
				
				if (!fs.existsSync(executable)) {
					throw new Error(`Executable not found: ${executable}`);
				}

				const child = spawn(executable, args);
				let output = '';
				let error = '';

				child.stdout?.on('data', (data) => {
					output += data.toString();
					this.log(data.toString().trim());
				});

				child.stderr?.on('data', (data) => {
					error += data.toString();
					this.log(`❌ Error: ${data.toString().trim()}`);
				});

				child.on('close', (code) => {
					if (code === 0) {
						resolve(output);
					} else {
						reject(new Error(`Process exited with code ${code}: ${error}`));
					}
				});
			} catch (err) {
				reject(err);
			}
		});
	}

	protected async runPowerShell(script: string): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				const result = execSync(`powershell.exe -NoProfile -Command "${script}"`, {
					encoding: 'utf-8',
					maxBuffer: 1024 * 1024 * 10
				});
				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	}

	protected async showProgress<T>(
		title: string,
		task: () => Promise<T>
	): Promise<T> {
		return vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: title,
				cancellable: false
			},
			async (progress) => {
				try {
					const result = await task();
					vscode.window.showInformationMessage(`✅ ${title} completed!`);
					return result;
				} catch (error) {
					vscode.window.showErrorMessage(`❌ ${title} failed: ${error}`);
					throw error;
				}
			}
		);
	}
}
