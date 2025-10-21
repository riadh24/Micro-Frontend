#!/usr/bin/env bash
# Helper to publish package to GitHub Packages
# Usage: ./scripts/publish-to-github-packages.sh

set -euo pipefail

read -p "GitHub username: " USERNAME
read -s -p "Personal access token (will be used as password): " TOKEN
echo

echo "Configuring npm to use GitHub Packages for @riadhazzabi scope..."
echo "Configuring npm to use GitHub Packages for @riadh24 scope..."
echo "@riadh24:registry=https://npm.pkg.github.com" > ~/.npmrc
npm set //npm.pkg.github.com/:_authToken "$TOKEN"

echo "Building package..."
npm run build

echo "Publishing to GitHub Packages..."
npm publish --registry=https://npm.pkg.github.com

echo "Done."