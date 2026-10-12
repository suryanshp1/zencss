# Releasing @suryanshp1/zencss

Only maintainers with publish permission for the `suryanshp1` npm scope should perform a registry release. Local build and packing commands do not publish anything.

## Prepare a version

Check what is already published:

```sh
npm view @suryanshp1/zencss version
```

For the first release use the prepared `0.1.0`. npm package versions cannot be replaced: for later changes, choose a new version in `packages/zencss/package.json`, update the React starter's workspace dependency version, and update `CHANGELOG.md`. Source distribution tests derive archive filenames from package manifests, so they follow the selected version.

Update the lockfile with `npm install` after changing workspace versions. Avoid promising a stable API while the project remains in alpha.

## Verify and pack

From the repository root:

```sh
npm run format:check
npm test
npm run build
npm run build:react
npm run test:package
```

`test:package` rebuilds and packs distributions, then tests installation, ESM/CommonJS imports, declaration resolution, CLI execution, Vite production output, and prebuilt CSS consumption in independent temporary applications.

The recommended package archive is `artifacts/suryanshp1-zencss-VERSION.tgz`. The optional `@zencss/*` split archives use unreserved working scopes and are not required for the all-in-one release.

## Inspect and publish

Replace VERSION with the version in the package manifest:

```sh
npm publish ./artifacts/suryanshp1-zencss-VERSION.tgz --access public --dry-run
npm login --auth-type=web
npm whoami
npm publish ./artifacts/suryanshp1-zencss-VERSION.tgz --access public
```

Confirm the logged-in npm account has scope access and complete the registry's publishing authentication prompt. The unscoped name `zencss` was rejected as too similar to `zen-css`; always use the scoped archive. Publishing from the repository root without a target is incorrect because the root workspace is private.

After publication:

```sh
npm view @suryanshp1/zencss version
npm install -D @suryanshp1/zencss
```

Verify the npm README and package metadata. Existing `0.x` releases use npm's selected dist-tag; use an explicit `--tag alpha` if you want an opt-in prerelease channel instead of `latest`.

## GitHub Actions CI and publishing

The verification workflow runs on pull requests, pushes to `main`/`master`, and manual dispatch. It checks Linux and macOS with Node 22.18 and 24, source/workflow formatting, compiler/documentation/integration tests, independent package installation, docs and starter builds. Its Node 24 Linux job saves npm archives and benchmark results as downloadable Actions artifacts. A dependent job installs the verified package archive and checks ESM/CommonJS imports and CLI execution on Node 20.19, the minimum supported consumer runtime. Benchmarks are recorded, not enforced as performance thresholds.

For registry releases, `.github/workflows/npm-publish.yml` is **manual only**. It runs verification first, accepts releases only from the repository's default branch, validates the requested version against the manifest/starter/changelog, and publishes only `@suryanshp1/zencss`. Stable numeric versions use `latest`; versions containing a prerelease suffix use `alpha`. It does not increment versions, create tags, or publish the optional split packages.

One-time setup after the first manual npm publication:

1. In GitHub repository settings, create an environment named `npm`. Configure required reviewers if you want release approval before publication.
2. In the npm settings for `@suryanshp1/zencss`, add a GitHub Actions trusted publisher:
   - Organization/user: `suryanshp1`
   - Repository: `zencss`
   - Workflow filename: `npm-publish.yml`
   - Environment: `npm`
   - Allow direct publishing with `npm publish`.
3. Commit the workflows and release version changes to the default branch.
4. Open GitHub Actions → **Publish ZenCSS to npm** → **Run workflow**, select the default branch, and enter the exact committed package version.
5. If reviewers are configured for the `npm` environment, approve the verified release there. Verify the registry version after the run succeeds.

The workflow uses Node 24, npm 11, GitHub-hosted runners, OIDC permission scoped to the publishing job, and package provenance. It needs no `NPM_TOKEN` secret. Do not add a registry authentication token to this workflow's environment, because that could override the intended OIDC authentication path. Configure npm's trusted publisher to match the workflow/environment exactly.

Official setup reference: https://docs.npmjs.com/trusted-publishers/
