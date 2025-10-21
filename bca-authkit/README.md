# @riadhazzabi/bca-authkit

This package provides BCA AuthKit — a TypeScript-authored set of React Native / Expo authentication helpers and components.

## Publish to GitHub Packages (local)

1. Create a GitHub Personal Access Token (PAT) with `write:packages` or equivalent access.
2. From the package directory run:

```bash
./scripts/publish-to-github-packages.sh
```

3. Follow prompts for username and token. The script will build and publish.

## Publish via GitHub Actions

This repository contains a GitHub Actions workflow that triggers when you publish a release. Create a release in GitHub (tag `vX.Y.Z`) and the workflow will run the build and publish step using `${{ secrets.GITHUB_TOKEN }}`.

Make sure the package scope (`name` in `package.json`) matches the GitHub account or organization that will publish (this package uses the `@riadh24` scope). Ensure repository settings allow GitHub Actions to create and publish packages for the repo/organization.
