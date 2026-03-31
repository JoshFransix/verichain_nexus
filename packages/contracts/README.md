# Agent Registry Contract

Solidity smart contract for managing AI agent registrations.

## Usage

```bash
npm run compile  # Compile contracts
npm run test     # Run tests
npm run deploy   # Deploy (adjust network in hardhat.config.ts)
npm run clean    # Clean artifacts
```

## Contract Functions

### Write
- `registerAgent(name, description, endpoint, capabilities)` - Register new agent
- `updateAgent(id, name, description, endpoint, capabilities)` - Update agent (owner only)
- `deactivateAgent(id)` - Deactivate agent (owner only)

### Read
- `getAgentById(id)` - Get agent by ID
- `getAllAgents()` - Get all agents
- `getActiveAgents()` - Get active agents only
- `getAgentsByOwner(address)` - Get agents by owner
- `getTotalAgents()` - Get total count

## Integration Example

```typescript
import { ethers } from 'ethers';

const registry = new ethers.Contract(address, abi, signer);

await registry.registerAgent(
  "Agent Name",
  "Description",
  "https://api.example.com",
  ["capability1", "capability2"]
);

const agents = await registry.getActiveAgents();
```

## Events

- `AgentRegistered(uint256 id, string name, address owner)`
- `AgentUpdated(uint256 id, string name)`
- `AgentDeactivated(uint256 id)`

## Errors

- `EmptyName()` - Name required
- `EmptyEndpoint()` - Endpoint required
- `AgentNotFound()` - Agent doesn't exist
- `Unauthorized()` - Not owner
- `AgentInactive()` - Agent is inactive
