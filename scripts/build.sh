#!/bin/bash

# Nettoyage des builds précédents
rm -rf www/
rm -rf android/
rm -rf ios/

# Installation des dépendances
npm install

# Build web
echo "Building web version..."
ionic build --prod

# Build Android
echo "Building Android version..."
ionic capacitor add android
ionic capacitor copy android
ionic capacitor update android

# Build iOS
echo "Building iOS version..."
ionic capacitor add ios
ionic capacitor copy ios
ionic capacitor update ios

echo "Build complete!"
