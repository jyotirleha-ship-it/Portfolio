const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PortfolioProjectRegistry", function () {
  let registry;
  let owner;
  let visitor;
  let sampleHash;

  beforeEach(async function () {
    [owner, visitor] = await ethers.getSigners();
    const PortfolioProjectRegistry = await ethers.getContractFactory("PortfolioProjectRegistry");
    registry = await PortfolioProjectRegistry.deploy();
    await registry.waitForDeployment();

    // Generate a sample SHA-256 hash (32 bytes)
    sampleHash = ethers.keccak256(ethers.toUtf8Bytes("Online Shopping Cart v1.0.0"));
  });

  it("should set the deployer as owner", async function () {
    expect(await registry.owner()).to.equal(owner.address);
  });

  it("should allow owner to register a project and emit ProjectRegistered", async function () {
    const tx = await registry.registerProject(
      "proj-online-shopping-cart",
      "Online Shopping Cart",
      "1.0.0",
      sampleHash
    );

    await expect(tx)
      .to.emit(registry, "ProjectRegistered")
      .withArgs(
        "proj-online-shopping-cart",
        "Online Shopping Cart",
        "1.0.0",
        sampleHash,
        (await ethers.provider.getBlock("latest")).timestamp
      );

    expect(await registry.getProjectsCount()).to.equal(1);
    expect(await registry.getProjectIdAtIndex(0)).to.equal("proj-online-shopping-cart");

    const project = await registry.getProject("proj-online-shopping-cart");
    expect(project.name).to.equal("Online Shopping Cart");
    expect(project.version).to.equal("1.0.0");
    expect(project.contentHash).to.equal(sampleHash);
    expect(project.exists).to.be.true;
  });

  it("should reject duplicate project registration", async function () {
    await registry.registerProject("proj-duplicate", "Duplicate", "1.0.0", sampleHash);
    await expect(
      registry.registerProject("proj-duplicate", "Duplicate 2", "2.0.0", sampleHash)
    ).to.be.revertedWith("Project already registered");
  });

  it("should prevent non-owners from registering a project", async function () {
    await expect(
      registry.connect(visitor).registerProject("proj-hack", "Hacked", "1.0.0", sampleHash)
    ).to.be.revertedWith("Only registry owner can call this");
  });

  it("should allow owner to update an existing project", async function () {
    await registry.registerProject("proj-update", "Original", "1.0.0", sampleHash);

    const newHash = ethers.keccak256(ethers.toUtf8Bytes("Updated v2.0.0"));
    const tx = await registry.updateProject("proj-update", "2.0.0", newHash);

    await expect(tx)
      .to.emit(registry, "ProjectUpdated")
      .withArgs(
        "proj-update",
        "2.0.0",
        sampleHash,
        newHash,
        (await ethers.provider.getBlock("latest")).timestamp
      );

    const updated = await registry.getProject("proj-update");
    expect(updated.version).to.equal("2.0.0");
    expect(updated.contentHash).to.equal(newHash);
  });

  it("should verify genuine hash and reject mismatched hash", async function () {
    await registry.registerProject("proj-verify", "Verify Test", "1.0.0", sampleHash);

    const verifySuccess = await registry.verifyProject("proj-verify", sampleHash);
    expect(verifySuccess.isValid).to.be.true;
    expect(verifySuccess.version).to.equal("1.0.0");
    expect(verifySuccess.name).to.equal("Verify Test");

    const wrongHash = ethers.keccak256(ethers.toUtf8Bytes("Tampered Content"));
    const verifyFail = await registry.verifyProject("proj-verify", wrongHash);
    expect(verifyFail.isValid).to.be.false;

    const verifyNonExistent = await registry.verifyProject("non-existent-id", sampleHash);
    expect(verifyNonExistent.isValid).to.be.false;
  });
});
