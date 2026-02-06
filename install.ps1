# AlgoLang Installation Script for Windows
# Usage: irm https://raw.githubusercontent.com/devalade/algo/main/install.ps1 | iex

param(
    [string]$Version = "latest"
)

$ErrorActionPreference = "Stop"

$Repo = "devalade/algo"
$BinaryName = "algolang-windows-amd64.exe"

Write-Host "AlgoLang Installer" -ForegroundColor Green
Write-Host ""

# Resolve version
if ($Version -eq "latest") {
    Write-Host "Récupération de la dernière version..."
    try {
        $Release = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/latest"
        $Version = $Release.tag_name
    } catch {
        Write-Host "Erreur: Impossible de récupérer la dernière version depuis GitHub." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Version: $Version"

# Download URL
$DownloadUrl = "https://github.com/$Repo/releases/download/$Version/$BinaryName"
Write-Host "Téléchargement depuis: $DownloadUrl"

# Install directory
$InstallDir = "$env:LOCALAPPDATA\AlgoLang\bin"
$InstallPath = Join-Path $InstallDir "algolang.exe"

# Create install directory if it doesn't exist
if (-not (Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
}

# Download binary
Write-Host "Téléchargement de $BinaryName..."
$TempFile = [System.IO.Path]::GetTempFileName()

try {
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $TempFile -UseBasicParsing
} catch {
    Write-Host "Erreur: Échec du téléchargement." -ForegroundColor Red
    Write-Host "Vérifiez que la version $Version existe pour $BinaryName."
    Remove-Item $TempFile -ErrorAction SilentlyContinue
    exit 1
}

# Install binary
Write-Host "Installation dans $InstallPath..."
Move-Item -Path $TempFile -Destination $InstallPath -Force

# Add to PATH if not already present
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$InstallDir*") {
    Write-Host "Ajout de $InstallDir au PATH..."
    [Environment]::SetEnvironmentVariable(
        "Path",
        "$UserPath;$InstallDir",
        "User"
    )
    $env:Path = "$env:Path;$InstallDir"
    Write-Host "✓ PATH mis à jour (redémarrez votre terminal pour appliquer les changements)" -ForegroundColor Yellow
}

# Verify installation
Write-Host ""
Write-Host "✓ Installation réussie!" -ForegroundColor Green
Write-Host ""

# Try to run version check
try {
    & $InstallPath --version
    Write-Host ""
    Write-Host "Utilisez 'algolang --help' pour voir les commandes disponibles."
} catch {
    Write-Host "Installation terminée à: $InstallPath" -ForegroundColor Yellow
    Write-Host "Redémarrez votre terminal puis utilisez 'algolang --help'."
}
