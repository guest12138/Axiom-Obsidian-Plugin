import { App, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf, Menu, normalizePath, TFile } from 'obsidian';

const VIEW_TYPE_AXIOM = "axiom-view";
const CASE_EXPORT_FOLDER = "C.A.S.E.";

class AxiomView extends ItemView {
	private frame: HTMLIFrameElement | null = null;
	private messageHandler: ((ev: MessageEvent) => void) | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_AXIOM;
	}

	getDisplayText() {
		return "C.A.S.E. Mind Map";
	}

	getIcon() {
		return "globe";
	}

	async onOpen() {
		const container = this.contentEl;
		container.empty();
		container.addClass("axiom-view-container");

		// Create the iframe
		const frame = container.createEl("iframe");
		this.frame = frame;
		frame.addClass("axiom-iframe");
		frame.setAttr("src", "https://axiom.ancelian.com/app.html");
		
		// Sandbox permissions
		frame.setAttr("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox allow-presentation allow-downloads");
		
		frame.style.width = "100%";
		frame.style.height = "100%";
		frame.style.border = "none";

		// Listen for messages from the iframe
		this.messageHandler = (ev: MessageEvent) => {
			if (ev.origin !== "https://axiom.ancelian.com") return;
			this.handleIframeMessage(ev.data);
		};
		window.addEventListener("message", this.messageHandler);
	}

	async onClose() {
		if (this.messageHandler) {
			window.removeEventListener("message", this.messageHandler);
			this.messageHandler = null;
		}
		this.frame = null;
	}

	/**
	 * Handle messages from the C.A.S.E. iframe.
	 * Supported messages:
	 *   { type: "case-save-file", path: "relative/path.json", content: "..." }
	 *   { type: "case-save-files", files: [{ path, content, encoding? }] }
	 *   { type: "case-export", files: [{ path, content, encoding? }] }
	 *   { type: "case-ping" } → responds with { type: "case-pong", vault: vaultName }
	 */
	private async handleIframeMessage(data: any) {
		if (!data || !data.type) return;

		const vault = this.app.vault;

		switch (data.type) {
			case "case-ping": {
				// Let the iframe know it's inside Obsidian, include vault note list
				const allNotes = vault.getMarkdownFiles().map((f: TFile) => ({
					basename: f.basename,
					path: f.path
				}));
				this.frame?.contentWindow?.postMessage(
					{ type: "case-pong", vault: vault.getName(), notes: allNotes },
					"https://axiom.ancelian.com"
				);
				break;
			}

			case "case-request-notes": {
				// Send updated note list on demand
				const notes = vault.getMarkdownFiles().map((f: TFile) => ({
					basename: f.basename,
					path: f.path
				}));
				this.frame?.contentWindow?.postMessage(
					{ type: "case-notes", notes },
					"https://axiom.ancelian.com"
				);
				break;
			}

			case "case-open-note": {
				// Open a note in Obsidian by basename or path
				if (!data.note) return;
				const noteName = data.note;
				// Try to find the file by path first, then by link text
				let targetFile = vault.getAbstractFileByPath(noteName + ".md")
					|| vault.getAbstractFileByPath(noteName);
				if (targetFile && targetFile instanceof TFile) {
					const leaf = this.app.workspace.getLeaf(false);
					await leaf.openFile(targetFile);
				} else {
					// Fallback: use openLinkText which handles partial matches
					await this.app.workspace.openLinkText(noteName, "");
				}
				break;
			}

			case "case-save-file": {
				if (!data.path || data.content === undefined) return;
				await this.saveFileToVault(data.path, data.content, data.encoding);
				break;
			}

			case "case-save-files":
			case "case-export": {
				if (!data.files || !Array.isArray(data.files)) return;
				const total = data.files.length;
				let saved = 0;
				for (const file of data.files) {
					if (!file.path || file.content === undefined) continue;
					await this.saveFileToVault(file.path, file.content, file.encoding);
					saved++;
				}
				// Notify iframe of completion
				this.frame?.contentWindow?.postMessage(
					{ type: "case-export-done", saved, total },
					"https://axiom.ancelian.com"
				);
				break;
			}
		}
	}

	/**
	 * Save a file to the Obsidian vault under the C.A.S.E. folder.
	 */
	private async saveFileToVault(relativePath: string, content: string, encoding?: string) {
		const vault = this.app.vault;
		const fullPath = normalizePath(`${CASE_EXPORT_FOLDER}/${relativePath}`);

		// Ensure parent directories exist
		const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
		if (dir) {
			await this.ensureFolder(dir);
		}

		try {
			if (encoding === "base64") {
				// Binary file (e.g. PNG) — decode base64 to ArrayBuffer
				const binary = atob(content);
				const bytes = new Uint8Array(binary.length);
				for (let i = 0; i < binary.length; i++) {
					bytes[i] = binary.charCodeAt(i);
				}
				const existing = vault.getAbstractFileByPath(fullPath);
				if (existing) {
					await vault.modifyBinary(existing as any, bytes.buffer);
				} else {
					await vault.createBinary(fullPath, bytes.buffer);
				}
			} else {
				// Text file (JSON, HTML, etc.)
				const existing = vault.getAbstractFileByPath(fullPath);
				if (existing) {
					await vault.modify(existing as any, content);
				} else {
					await vault.create(fullPath, content);
				}
			}
		} catch (err) {
			console.error(`[C.A.S.E.] Failed to save ${fullPath}:`, err);
		}
	}

	/**
	 * Recursively ensure a folder path exists in the vault.
	 */
	private async ensureFolder(folderPath: string) {
		const vault = this.app.vault;
		const normalized = normalizePath(folderPath);
		if (vault.getAbstractFileByPath(normalized)) return;

		// Ensure parent exists first
		const parent = normalized.substring(0, normalized.lastIndexOf("/"));
		if (parent) {
			await this.ensureFolder(parent);
		}

		try {
			await vault.createFolder(normalized);
		} catch {
			// Folder might already exist (race condition)
		}
	}
}

export default class AxiomPlugin extends Plugin {
	async onload() {
		// Register the View
		this.registerView(
			VIEW_TYPE_AXIOM,
			(leaf) => new AxiomView(leaf)
		);

		// Add Ribbon Icon to open the view
		this.addRibbonIcon('globe', 'Open Axiom 3D Mind Map', (evt: MouseEvent) => {
			this.activateView();
		});

		// Add Command to open the view
		this.addCommand({
			id: 'open-axiom-mind-map',
			name: 'Open Axiom 3D Mind Map',
			callback: () => {
				this.activateView();
			}
		});
	}

	onunload() {

	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_AXIOM);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could be in the right sidebar
			const rightLeaf = workspace.getRightLeaf(false);
			if (rightLeaf) {
				leaf = rightLeaf;
				await leaf.setViewState({ type: VIEW_TYPE_AXIOM, active: true });
			}
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}
}
