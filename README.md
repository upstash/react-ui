<div align="center">
    <h1 align="center">React UI</h1>
    <h5>Various react components from our console</h5>
</div>

<div align="center">
  <a href="https://console.upstash.com">console.upstash.com</a>
</div>
<br/>

> [!NOTE]  
> **This project is in the Experimental Stage.**
>
> We declare this project experimental to set clear expectations for your usage. There could be known or unknown bugs, the API could evolve, or the project could be discontinued if it does not find community adoption. While we cannot provide professional support for experimental projects, we’d be happy to hear from you if you see value in this project!

## Components

- [Redis CLI](https://github.com/upstash/react-ui/blob/main/packages/react-cli/README.md)
- [Redis Databrowser](https://github.com/upstash/react-ui/blob/main/packages/react-databrowser/README.md)

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

#### Run Test

Set the `NEXT_PUBLIC_UPSTASH_REDIS_REST_URL` and `NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN` environment
variables by creating a `.env` file under `examples/nextjs13`.

```bash
cd examples/nextjs
npx playwright install
pnpm test
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
