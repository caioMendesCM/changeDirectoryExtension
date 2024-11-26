const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	const disposable = vscode.commands.registerCommand('changedirectoryextension.chandeDirectory', async () => {
		const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

		if (!rootPath) {
			vscode.window.showErrorMessage('No folder or workspace is currently open.');
			return;
		}
		let navigate = false;
		let currentNavigation = '';

		while(!navigate) {
			let folderNames = [];
	
			try {
				const uri = path.join(rootPath, currentNavigation);
				folderNames = fs.readdirSync(uri)
						.filter(item => {
								const itemPath = path.join(uri, item);
								return fs.statSync(itemPath).isDirectory();
						});
			} catch (error) {
				vscode.window.showErrorMessage(`Error reading folders: ${error.message}`);
			}
	
			const folderUri = await vscode.window.showQuickPick(['.', '..', ...folderNames], { canPickMany: false });
	
			if (!folderUri) {
				return;
			}

			if (folderUri === '.') {
				navigate = true;
			} else {
				currentNavigation = path.join(currentNavigation, folderUri);
			}

			const uri = vscode.Uri.file(path.join(rootPath, currentNavigation));
			if (navigate) {
				vscode.commands.executeCommand('vscode.openFolder', uri, { forceReuseWindow: true });
			}
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
