#!/usr/bin/env bash
set -e

# AlgoLang Installation Script for Linux/macOS
# Usage: curl -fsSL https://raw.githubusercontent.com/devalade/algo/main/install.sh | bash

REPO="devalade/algo"
INSTALL_DIR=""
VERSION="${1:-latest}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}AlgoLang Installer${NC}"
echo ""

# Detect OS
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
case "$OS" in
  linux*)
    OS="linux"
    ;;
  darwin*)
    OS="darwin"
    ;;
  *)
    echo -e "${RED}Erreur: Système d'exploitation non supporté: $OS${NC}"
    echo "AlgoLang supporte uniquement Linux et macOS."
    exit 1
    ;;
esac

# Detect architecture
ARCH=$(uname -m)
case "$ARCH" in
  x86_64|amd64)
    ARCH="amd64"
    ;;
  aarch64|arm64)
    ARCH="arm64"
    ;;
  *)
    echo -e "${RED}Erreur: Architecture non supportée: $ARCH${NC}"
    echo "AlgoLang supporte uniquement x86_64 (amd64) et arm64."
    exit 1
    ;;
esac

BINARY_NAME="algolang-${OS}-${ARCH}"
echo "Détection: $OS ($ARCH)"

# Resolve version
if [ "$VERSION" = "latest" ]; then
  echo "Récupération de la dernière version..."
  VERSION=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
  if [ -z "$VERSION" ]; then
    echo -e "${RED}Erreur: Impossible de récupérer la dernière version depuis GitHub.${NC}"
    exit 1
  fi
fi

echo "Version: $VERSION"

# Download URL
DOWNLOAD_URL="https://github.com/$REPO/releases/download/$VERSION/$BINARY_NAME"
echo "Téléchargement depuis: $DOWNLOAD_URL"

# Determine install directory
if [ -w "/usr/local/bin" ]; then
  INSTALL_DIR="/usr/local/bin"
elif [ -d "$HOME/.local/bin" ]; then
  INSTALL_DIR="$HOME/.local/bin"
else
  mkdir -p "$HOME/.local/bin"
  INSTALL_DIR="$HOME/.local/bin"
fi

INSTALL_PATH="$INSTALL_DIR/algolang"

# Download binary
TMP_FILE=$(mktemp)
echo "Téléchargement de $BINARY_NAME..."

if ! curl -fsSL "$DOWNLOAD_URL" -o "$TMP_FILE"; then
  echo -e "${RED}Erreur: Échec du téléchargement.${NC}"
  echo "Vérifiez que la version $VERSION existe pour $BINARY_NAME."
  rm -f "$TMP_FILE"
  exit 1
fi

# Install binary
echo "Installation dans $INSTALL_PATH..."

if [ "$INSTALL_DIR" = "/usr/local/bin" ] && [ ! -w "/usr/local/bin" ]; then
  sudo mv "$TMP_FILE" "$INSTALL_PATH"
  sudo chmod +x "$INSTALL_PATH"
else
  mv "$TMP_FILE" "$INSTALL_PATH"
  chmod +x "$INSTALL_PATH"
fi

# Verify installation
if command -v algolang &> /dev/null; then
  echo -e "${GREEN}✓ Installation réussie!${NC}"
  echo ""
  algolang --version
  echo ""
  echo "Utilisez 'algolang --help' pour voir les commandes disponibles."
else
  echo -e "${YELLOW}⚠ Installation terminée, mais 'algolang' n'est pas dans le PATH.${NC}"
  echo ""
  echo "Ajoutez cette ligne à votre ~/.bashrc ou ~/.zshrc:"
  echo "  export PATH=\"\$PATH:$INSTALL_DIR\""
  echo ""
  echo "Puis rechargez votre shell:"
  echo "  source ~/.bashrc  # ou ~/.zshrc"
fi
