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
