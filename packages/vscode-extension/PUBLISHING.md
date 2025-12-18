# Publication de l'extension AlgoLang

Ce guide explique comment publier l'extension AlgoLang sur le Visual Studio Marketplace.

## 1. Prérequis

- Un compte [Microsoft Azure DevOps](https://dev.azure.com/).
- Un **Personal Access Token (PAT)** avec les permissions `Marketplace (Publish-only)`.
- L'outil `vsce` (Visual Studio Code Extension Manager).

```bash
npm install -g @vscode/vsce
```

## 2. Créer un Éditeur (Publisher)

Si vous n'avez pas encore d'éditeur sur le Marketplace :
1. Allez sur le [Management Dashboard](https://marketplace.visualstudio.com/manage).
2. Créez un nouvel éditeur avec l'ID `algolang-team` (ou celui défini dans votre `package.json`).

## 3. Connexion locale

```bash
vsce login algolang-team
# Entrez votre PAT quand demandé
```

## 4. Packaging (.vsix)

Avant de publier, vous pouvez générer le fichier `.vsix` pour le tester localement.

```bash
cd packages/vscode-extension
vsce package
```

Cela créera un fichier `algolang-vscode-1.0.0.vsix`. Vous pouvez l'installer dans VS Code via `Extensions -> ... -> Install from VSIX`.

## 5. Publication

Une fois prêt, lancez la publication automatique :

```bash
vsce publish
```

## 6. Mise à jour de la version

Pour publier une nouvelle version :
1. Mettez à jour le numéro de version (ex: `1.0.1`).
2. Re-compilez (`bun build` ou `tsc`).
3. Relancez `vsce publish`.

---
*Note : Assurez-vous d'avoir rempli le fichier README.md de l'extension pour qu'il s'affiche proprement sur le Marketplace.*
