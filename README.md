# Axiom - 3D Mind Map for Obsidian

> **🚧 Beta Access Notice**
>
> This plugin is currently in **Beta** and is being reviewed for the official Obsidian Community Plugins list.
> To use it right now, you need to install it via **BRAT**.

## 🚀 How to Install (Beta)

1. **Install BRAT**: Search for `BRAT` in the Obsidian Community Plugins and install it.
2. **Add Beta Plugin**:
   - Open Obsidian Settings > **BRAT** (sidebar).
   - Click **Add Beta plugin**.
   - Paste this URL: `https://github.com/guest12138/Axiom-Obsidian-Plugin`
   - Click **Add Plugin**.
3. **Enable**: Go to Community Plugins and enable **Axiom - 3D Mind Map**.

---

This plugin embeds the [Axiom 3D Mind Map](https://axiom.ancelian.com) application directly into Obsidian's sidebar.

## Features

- **Seamless Integration**: View and edit your Axiom mind maps without leaving Obsidian.
- **3D Visualization**: Leverage the full power of Axiom's 3D rendering engine within your notes environment.
- **Synchronization**: Changes made in the embedded view are instantly synchronized with your Axiom account.

## Usage

1. **Open the View**: Click the "Globe" icon in the ribbon or use the command palette (`Open Axiom 3D Mind Map`) to open the view.
2. **Login**: If you are not logged in, the view will prompt you to log in to your Axiom account.
3. **Interact**: Use the mouse to navigate the 3D space, create nodes, and edit your mind map.

## Privacy & Security

This plugin uses an `iframe` to load the Axiom web application (`https://axiom.ancelian.com`).

- **Data Handling**: All data shown in the mind map is loaded directly from Axiom's servers. The plugin itself does not store your mind map data locally in Obsidian, nor does it intercept your login credentials.
- **Network Requests**: The plugin makes network requests to `axiom.ancelian.com` to load the application and sync data.
- **Authentication**: Authentication is handled securely by the Axiom web application. The plugin does not have access to your password.

## Installation

1. Search for "Axiom" in the Obsidian Community Plugins (once approved).
2. Click Install.
3. Enable the plugin.

## Manual Installation

1. Download the `main.js`, `manifest.json`, and `styles.css` from the latest release.
2. Create a folder `axiom-mindmap` in your vault's `.obsidian/plugins/` directory.
3. Place the files in that folder.
4. Reload Obsidian.
