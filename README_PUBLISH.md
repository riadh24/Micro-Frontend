# Publishing `@riadh24/bca-authkit` via GitHub Actions

This repository includes a repo-root workflow that publishes `packages/bca-authkit` to GitHub Packages when you push a tag `v*` or publish a release.

How to trigger

- Create a tag and push it:

```bash
# from repository root
git tag v1.0.1
git push origin v1.0.1
```

- Or create a release on GitHub (which triggers the `release.published` event).

Permissions

- Ensure Actions workflow permissions are set to allow writing packages:
  - Repository Settings → Actions → General → Workflow permissions → set to "Read and write permissions".
  - Also ensure "Allow GitHub Actions to create and publish packages" is enabled if present.

Notes

- The workflow uses `${{ secrets.GITHUB_TOKEN }}` to authenticate and publish. If your repo requires a PAT instead (e.g., for org-level restrictions), add a secret like `NPM_TOKEN` and update the workflow to use it.
