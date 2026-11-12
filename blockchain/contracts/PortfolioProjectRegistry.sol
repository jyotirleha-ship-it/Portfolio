// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PortfolioProjectRegistry
 * @dev Cryptographic registry for verifying projects on Ethereum Sepolia.
 * Built for Jyotir Leha R's "Digital Universe" Portfolio.
 */
contract PortfolioProjectRegistry {
    address public owner;

    struct ProjectRecord {
        string projectId;
        string name;
        string version;
        bytes32 contentHash; // SHA-256 hash of project metadata
        uint256 createdAt;
        uint256 updatedAt;
        bool exists;
    }

    // Mapping from projectId => ProjectRecord
    mapping(string => ProjectRecord) private projects;

    // List of registered project IDs for enumeration
    string[] private projectIds;

    // Events
    event ProjectRegistered(
        string indexed projectId,
        string name,
        string version,
        bytes32 contentHash,
        uint256 timestamp
    );

    event ProjectUpdated(
        string indexed projectId,
        string version,
        bytes32 oldContentHash,
        bytes32 newContentHash,
        uint256 timestamp
    );

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only registry owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @notice Register a new project hash
     */
    function registerProject(
        string calldata projectId,
        string calldata name,
        string calldata version,
        bytes32 contentHash
    ) external onlyOwner {
        require(bytes(projectId).length > 0, "Project ID cannot be empty");
        require(contentHash != bytes32(0), "Content hash cannot be zero");
        require(!projects[projectId].exists, "Project already registered");

        projects[projectId] = ProjectRecord({
            projectId: projectId,
            name: name,
            version: version,
            contentHash: contentHash,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            exists: true
        });

        projectIds.push(projectId);

        emit ProjectRegistered(projectId, name, version, contentHash, block.timestamp);
    }

    /**
     * @notice Update an existing project's version and content hash
     */
    function updateProject(
        string calldata projectId,
        string calldata version,
        bytes32 newContentHash
    ) external onlyOwner {
        require(projects[projectId].exists, "Project not registered");
        require(newContentHash != bytes32(0), "New hash cannot be zero");

        bytes32 oldHash = projects[projectId].contentHash;
        projects[projectId].version = version;
        projects[projectId].contentHash = newContentHash;
        projects[projectId].updatedAt = block.timestamp;

        emit ProjectUpdated(projectId, version, oldHash, newContentHash, block.timestamp);
    }

    /**
     * @notice Public function to verify if a given content hash matches the recorded project
     */
    function verifyProject(
        string calldata projectId,
        bytes32 testContentHash
    ) external view returns (
        bool isValid,
        uint256 registeredAt,
        uint256 updatedAt,
        string memory version,
        string memory name
    ) {
        if (!projects[projectId].exists) {
            return (false, 0, 0, "", "");
        }

        ProjectRecord memory record = projects[projectId];
        bool matchFound = (record.contentHash == testContentHash);

        return (
            matchFound,
            record.createdAt,
            record.updatedAt,
            record.version,
            record.name
        );
    }

    /**
     * @notice Retrieve project details
     */
    function getProject(string calldata projectId) external view returns (
        string memory name,
        string memory version,
        bytes32 contentHash,
        uint256 createdAt,
        uint256 updatedAt,
        bool exists
    ) {
        ProjectRecord memory record = projects[projectId];
        return (
            record.name,
            record.version,
            record.contentHash,
            record.createdAt,
            record.updatedAt,
            record.exists
        );
    }

    /**
     * @notice Retrieve total registered projects count
     */
    function getProjectsCount() external view returns (uint256) {
        return projectIds.length;
    }

    /**
     * @notice Retrieve project ID at index
     */
    function getProjectIdAtIndex(uint256 index) external view returns (string memory) {
        require(index < projectIds.length, "Index out of bounds");
        return projectIds[index];
    }
}
