<div align="center">
    <h1 align="center">React UI</h1>
    <h5>Various react components from our console</h5>
</div>

<div align="center">
  <a href="https://console.upstash.com">console.upstash.com</a>
</div>
<br/>



## Components

- [Redis CLI](https://github.com/upstash/react-ui/blob/main/packages/react-cli/README.md)


<br/>



## Development

This monorepo is managed by turborepo and uses `pnpm` for dependency management.

#### Install dependencies

```bash
pnpm install
```

#### Build

```bash
pnpm build
```



## Release

1. Run `pnpm changeset`
This will prompt you to select which packages have changed. It will also create a changeset file in the `.changeset` directory.
2. Run `pnpm changeset version`
This will bump the versions of the packages previously specified with pnpm changeset (and any dependents of those) and update the changelog files.
3. Run `pnpm install` 
This will update the lockfile and rebuild packages.
4. Commit the changes
5. Run `pnpm publish -r`
This command will publish all packages that have bumped versions not yet present in the registry.