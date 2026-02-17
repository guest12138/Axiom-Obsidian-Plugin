import { App, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf, Menu } from 'obsidian';

const VIEW_TYPE_AXIOM = "axiom-view";

class AxiomView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_AXIOM;
	}

	getDisplayText() {
		return "Axiom 3D Mind Map";
	}

	getIcon() {
		return "globe"; // Using a generic icon for now
	}

	async onOpen() {
		const container = this.contentEl;
		container.empty();
		container.addClass("axiom-view-container");

		// Create the iframe
		const frame = container.createEl("iframe");
		frame.addClass("axiom-iframe");
		frame.setAttr("src", "https://axiom-87ac8.web.app/app.html");
		
		// Security & Functionality attributes
		// allow-scripts: Required for the web app to run
		// allow-same-origin: Required for authentication (cookies/localStorage)
		// allow-popups: Required for OAuth flows if used
		// allow-forms: Required for login forms
		// allow-popups-to-escape-sandbox: CRITICAL for Google Auth to work in iframe
		frame.setAttr("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox allow-presentation");
		
		// Styling directly on element to ensure it takes full space, can be moved to CSS
		frame.style.width = "100%";
		frame.style.height = "100%";
		frame.style.border = "none";
	}

	async onClose() {
		// Cleanup if necessary
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
