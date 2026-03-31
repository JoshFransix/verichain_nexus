# VeriChain Nexus

A clean, scalable Nx monorepo for blockchain development with Next.js, NestJS, and Hardhat.

## Structure

```
verichain-nexus/
├── apps/
│   ├── web/           # Next.js frontend (App Router, TypeScript)
│   ├── api/           # NestJS backend (TypeScript)
│   ├── web-e2e/       # E2E tests for web
│   └── api-e2e/       # E2E tests for api
├── packages/
│   ├── contracts/     # Solidity smart contracts (Hardhat)
│   └── types/         # Shared TypeScript types
└── nx.json            # Nx workspace configuration
```

## Quick Start

### Install Dependencies

```bash
npm install
```

### Development

Run the Next.js frontend:
```bash
npx nx dev @verichain-nexus/web
```

Run the NestJS backend:
```bash
npx nx serve api
```

Compile smart contracts:
```bash
cd packages/contracts
npm run compile
```

### Build

Build all apps:
```bash
npx nx run-many --target=build
```

Build specific app:
```bash
npx nx build @verichain-nexus/web
npx nx build api
```

### Smart Contracts

Navigate to contracts directory:
```bash
cd packages/contracts
```

Compile contracts:
```bash
npm run compile
```

Run tests:
```bash
npm run test
```

Clean artifacts:
```bash
npm run clean
```

## Importing Shared Types

Apps can import from the shared types package:

```typescript
import { User, Transaction, Status } from '@verichain-nexus/types';
```

## Project Graph

Visualize project dependencies:
```bash
npx nx graph
```

## Tech Stack

- **Nx** - Monorepo tool
- **Next.js 16** - Frontend framework with App Router
- **NestJS** - Backend framework
- **Hardhat** - Smart contract development
- **TypeScript** - Type safety across all projects
- **Prettier** - Code formatting

```sh
npx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
