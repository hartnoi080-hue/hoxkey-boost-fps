import * as vscode from 'vscode';
import { RestorePointHandler } from './handlers/restorePoint';
import { DeleteTempFilesHandler } from './handlers/deleteTempFiles';
import { WindowsFPSHandler } from './handlers/windowsFPS';
import { GPUOptimizeHandler } from './handlers/gpuOptimize';
import { CPUOptimizeHandler } from './handlers/cpuOptimize';
import { PriorityControlHandler } from './handlers/priorityControl';
import { PowerPlanHandler } from './handlers/powerPlan';
import { LowInputLagHandler } from './handlers/lowInputLag';
import { PowerRunTweaksHandler } from './handlers/powerRunTweaks';
import { AppCleanerRAMHandler } from './handlers/appCleanerRam';
import { CortanaDisablerHandler } from './handlers/cortanaDisabler';
import { DeviceManagerHandler } from './handlers/deviceManager';
import { ServicesSetHandler } from './handlers/servicesSet';
import { RegistryDisablerHandler } from './handlers/registryDisabler';
import { FivemVideosHandler } from './handlers/fivemVideos';
import { PlaybookHandler } from './handlers/playbook';
import { HWIDLockHandler } from './handlers/hwIdLock';
import { ToolsHandler } from './handlers/tools';
import { HistoryHandler } from './handlers/history';
import { HoxkeyStatusBar } from './ui/statusBar';
import { HoxkeyExplorer } from './ui/explorer';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
	console.log('Hoxkey Boost FPS is now active!');

	// Create output channel
	outputChannel = vscode.window.createOutputChannel('Hoxkey Boost FPS');
	outputChannel.show();
	outputChannel.appendLine('🚀 Hoxkey Boost FPS Extension Activated');

	// Initialize UI components
	const statusBar = new HoxkeyStatusBar();
	const explorer = new HoxkeyExplorer();

	// Register all command handlers
	const handlers = [
		new RestorePointHandler(outputChannel),
		new DeleteTempFilesHandler(outputChannel),
		new WindowsFPSHandler(outputChannel),
		new GPUOptimizeHandler(outputChannel),
		new CPUOptimizeHandler(outputChannel),
		new PriorityControlHandler(outputChannel),
		new PowerPlanHandler(outputChannel),
		new LowInputLagHandler(outputChannel),
		new PowerRunTweaksHandler(outputChannel),
		new AppCleanerRAMHandler(outputChannel),
		new CortanaDisablerHandler(outputChannel),
		new DeviceManagerHandler(outputChannel),
		new ServicesSetHandler(outputChannel),
		new RegistryDisablerHandler(outputChannel),
		new FivemVideosHandler(outputChannel),
		new PlaybookHandler(outputChannel),
		new HWIDLockHandler(outputChannel),
		new ToolsHandler(outputChannel),
		new HistoryHandler(outputChannel)
	];

	// Register commands
	handlers.forEach(handler => {
		context.subscriptions.push(
			vscode.commands.registerCommand(handler.commandId, () => handler.execute())
		);
	});

	outputChannel.appendLine('✅ All commands registered successfully');
}

export function deactivate() {
	if (outputChannel) {
		outputChannel.appendLine('🛑 Hoxkey Boost FPS Extension Deactivated');
		outputChannel.dispose();
	}
}
