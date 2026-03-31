// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract AgentRegistry {
    struct Agent {
        uint256 id;
        string name;
        string description;
        string endpoint;
        string[] capabilities;
        address owner;
        bool isActive;
        uint256 createdAt;
    }

    uint256 private nextAgentId;
    mapping(uint256 => Agent) private agents;
    uint256[] private agentIds;

    event AgentRegistered(
        uint256 indexed id,
        string name,
        address indexed owner
    );
    event AgentUpdated(uint256 indexed id, string name);
    event AgentDeactivated(uint256 indexed id);

    error EmptyName();
    error EmptyEndpoint();
    error AgentNotFound();
    error Unauthorized();
    error AgentInactive();

    modifier onlyAgentOwner(uint256 agentId) {
        if (agents[agentId].owner != msg.sender) revert Unauthorized();
        _;
    }

    modifier agentExists(uint256 agentId) {
        if (agents[agentId].createdAt == 0) revert AgentNotFound();
        _;
    }

    function registerAgent(
        string calldata name,
        string calldata description,
        string calldata endpoint,
        string[] calldata capabilities
    ) external returns (uint256) {
        if (bytes(name).length == 0) revert EmptyName();
        if (bytes(endpoint).length == 0) revert EmptyEndpoint();

        uint256 agentId = nextAgentId++;

        Agent storage agent = agents[agentId];
        agent.id = agentId;
        agent.name = name;
        agent.description = description;
        agent.endpoint = endpoint;
        agent.capabilities = capabilities;
        agent.owner = msg.sender;
        agent.isActive = true;
        agent.createdAt = block.timestamp;

        agentIds.push(agentId);

        emit AgentRegistered(agentId, name, msg.sender);

        return agentId;
    }

    function updateAgent(
        uint256 agentId,
        string calldata name,
        string calldata description,
        string calldata endpoint,
        string[] calldata capabilities
    ) external onlyAgentOwner(agentId) agentExists(agentId) {
        if (bytes(name).length == 0) revert EmptyName();
        if (bytes(endpoint).length == 0) revert EmptyEndpoint();
        if (!agents[agentId].isActive) revert AgentInactive();

        Agent storage agent = agents[agentId];
        agent.name = name;
        agent.description = description;
        agent.endpoint = endpoint;
        agent.capabilities = capabilities;

        emit AgentUpdated(agentId, name);
    }

    function deactivateAgent(
        uint256 agentId
    ) external onlyAgentOwner(agentId) agentExists(agentId) {
        if (!agents[agentId].isActive) revert AgentInactive();

        agents[agentId].isActive = false;

        emit AgentDeactivated(agentId);
    }

    function getAgentById(
        uint256 agentId
    ) external view agentExists(agentId) returns (Agent memory) {
        return agents[agentId];
    }

    function getAllAgents() external view returns (Agent[] memory) {
        uint256 totalAgents = agentIds.length;
        Agent[] memory allAgents = new Agent[](totalAgents);

        for (uint256 i = 0; i < totalAgents; i++) {
            allAgents[i] = agents[agentIds[i]];
        }

        return allAgents;
    }

    function getActiveAgents() external view returns (Agent[] memory) {
        uint256 activeCount = 0;
        uint256 totalAgents = agentIds.length;

        for (uint256 i = 0; i < totalAgents; i++) {
            if (agents[agentIds[i]].isActive) {
                activeCount++;
            }
        }

        Agent[] memory activeAgents = new Agent[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalAgents; i++) {
            if (agents[agentIds[i]].isActive) {
                activeAgents[currentIndex] = agents[agentIds[i]];
                currentIndex++;
            }
        }

        return activeAgents;
    }

    function getAgentsByOwner(
        address owner
    ) external view returns (Agent[] memory) {
        uint256 ownerAgentCount = 0;
        uint256 totalAgents = agentIds.length;

        for (uint256 i = 0; i < totalAgents; i++) {
            if (agents[agentIds[i]].owner == owner) {
                ownerAgentCount++;
            }
        }

        Agent[] memory ownerAgents = new Agent[](ownerAgentCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalAgents; i++) {
            if (agents[agentIds[i]].owner == owner) {
                ownerAgents[currentIndex] = agents[agentIds[i]];
                currentIndex++;
            }
        }

        return ownerAgents;
    }

    function getTotalAgents() external view returns (uint256) {
        return agentIds.length;
    }
}
