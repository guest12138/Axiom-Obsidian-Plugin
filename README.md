# C.A.S.E. - Mind Map for Obsidian

> **🚧 Beta Access Notice**
>
> This plugin is currently in **Beta** and is being reviewed for the official Obsidian Community Plugins list.
> To use it right now, you need to install it via **BRAT**.

## Pricing

**Completely free.** No limits, no subscriptions. All features are available to every user.

## 🚀 How to Install (Beta)

1. **Install BRAT**: Search for `BRAT` in the Obsidian Community Plugins and install it.
2. **Add Beta Plugin**:
   - Open Obsidian Settings > **BRAT** (sidebar).
   - Click **Add Beta plugin**.
   - Paste this URL: `https://github.com/guest12138/Axiom-Obsidian-Plugin`
   - Click **Add Plugin**.
3. **Enable**: Go to Community Plugins and enable **C.A.S.E. - Mind Map**.

---

This plugin embeds the [C.A.S.E. Mind Map](https://axiom.ancelian.com) application directly into Obsidian's sidebar.

## Features

- **Completely Free**: All features, unlimited spaces, maps, and nodes — no paywalls.
- **Seamless Integration**: View and edit your mind maps without leaving Obsidian.
- **Bidirectional Links**: Use `[[Note Title]]` syntax in node text to create links to your Obsidian notes. Links render as blue text — click to navigate directly in Obsidian.
- **Export to Vault**: Export all your mind map data (JSON, HTML, PNG) directly into your Obsidian vault with one click.
- **Local Storage (OPFS)**: Data is stored locally in the browser's Origin Private File System — no cloud dependency.
- **Multiple Views**: Switch between mind map, outline, list, day/week/month calendar views.

## Usage

1. **Open the View**: Click the "Globe" icon in the ribbon or use the command palette (`Open C.A.S.E. Mind Map`) to open the view.
2. **Login**: If you are not logged in, the view will prompt you to log in to your account.
   > **⚠️ Login Troubleshooting**
   > If you experience issues signing up or logging in with Google/Email directly within Obsidian:
   > 1. Open [https://axiom.ancelian.com](https://axiom.ancelian.com) in your regular browser (Chrome/Safari).
   > 2. Sign up or log in there using your preferred method (Google or Email).
   > 3. **Important**: If you used Google Login, please set a password for your account in the web settings.
   > 4. Return to Obsidian and log in using your **Email and Password**.
3. **Create Mind Maps**: Use the mouse to navigate, create nodes, and edit your mind maps.
4. **Wiki Links**: While editing a node, type `[[` to search and link to any note in your vault. Click the blue link text to jump to the note.
5. **Export**: Go to Settings > Data Storage > "SAVE TO VAULT" to export all data into your Obsidian vault.

## Privacy & Security

This plugin uses an `iframe` to load the C.A.S.E. web application (`https://axiom.ancelian.com`).

- **Data Handling**: Data is stored locally in the browser's OPFS (Origin Private File System). The plugin does not intercept your login credentials.
- **Network Requests**: The plugin makes network requests to `axiom.ancelian.com` to load the application UI.
- **Authentication**: Authentication is handled securely by the web application via Firebase Auth.
- **Vault Access**: The plugin accesses your vault's note list (names and paths only) to enable bidirectional linking. Export files are saved under a `C.A.S.E./` folder in your vault.

## Installation

1. Search for "C.A.S.E." in the Obsidian Community Plugins (once approved).
2. Click Install.
3. Enable the plugin.

## Manual Installation

1. Download the `main.js`, `manifest.json`, and `styles.css` from the latest release.
2. Create a folder `axiom-mindmap` in your vault's `.obsidian/plugins/` directory.
3. Place the files in that folder.
4. Reload Obsidian.

Join our discord: https://discord.gg/cXMBKGzdyB
