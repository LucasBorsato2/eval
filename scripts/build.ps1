# Script PowerShell pour Windows

# Nettoyage des builds précédents
Write-Host "Cleaning previous builds..."
if (Test-Path www) { Remove-Item -Recurse -Force www }
if (Test-Path android) { Remove-Item -Recurse -Force android }
if (Test-Path ios) { Remove-Item -Recurse -Force ios }

# Installation des dépendances
Write-Host "Installing dependencies..."
npm install

# Build web
Write-Host "Building web version..."
ionic build --prod

# Build Android
Write-Host "Building Android version..."
ionic capacitor add android
ionic capacitor copy android
ionic capacitor update android

Write-Host "Build complete!"
