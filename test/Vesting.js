// Import the required libraries
const { ethers } = require("hardhat");
const { expect } = require("chai");

// Contract test suite
describe("Vesting Contract", function () {
  let vestingContract;
  let owner;
  let organization;
  let stakeholder;
  let transactPrice ;

  beforeEach(async function () {
    // Deploy the Vesting contract
    const Vesting = await ethers.getContractFactory("Vesting");
    vestingContract = await Vesting.deploy("TestToken", "TT");
    
    await vestingContract.deployed();

    // Get the transaction price for the contract
    transactPrice = await vestingContract.getTransactPrice();
    transactPrice = transactPrice.toString();

    // Get the deployed contract owner and two accounts for organization and stakeholder
    [owner, organization, stakeholder] = await ethers.getSigners();
  });

  it("should register an organization", async function () {
    // Register an organization
    await vestingContract.connect(organization).registerOrganization(
      "Test Organization",
      "TO",
      "test@example.com",
      organization.address,
      { value: transactPrice }
    );

    // Check if the organization is registered correctly
    const orgAddress = await vestingContract.email_to_address("test@example.com");
    const org = await vestingContract.organizations(1);

    // Assertions
    expect(orgAddress).to.equal(organization.address);
    expect(org.orgAddress).to.equal(organization.address);
    expect(org.id).to.equal(1);
    expect(org.name).to.equal("Test Organization");
    expect(org.symbol).to.equal("TO");
  });

  it("should add a stakeholder", async function () {
    // Register an organization
    await vestingContract.connect(organization).registerOrganization(
      "Test Organization",
      "TO",
      "test1@example.com",
      organization.address,
      { value: transactPrice }
    );

    // Add a stakeholder
    await vestingContract.connect(organization).addStakeholder(
      stakeholder.address,
      "Stakeholder",
      1000,
      1000,
      "test2@example.com",
      1,
      { value: transactPrice }
    );

    // Check if the stakeholder is added correctly
    const stakeholderAddress = await vestingContract.email_to_address("test2@example.com");
    const stakeholderInfo = await vestingContract.stakeholders(1);

    // Assertions
    expect(stakeholderAddress).to.equal(stakeholder.address);
    expect(stakeholderInfo.id).to.equal(1);
    expect(stakeholderInfo.orgId).to.equal(1);
    expect(stakeholderInfo.userAddress).to.equal(stakeholder.address);
    expect(stakeholderInfo.role).to.equal("Stakeholder");
    expect(stakeholderInfo.endTime).to.equal(1000);
    expect(stakeholderInfo.startTime).to.not.equal(0);
    expect(stakeholderInfo.vestingPeriod).to.not.equal(0);
    expect(stakeholderInfo.tokenAmount).to.equal(1000);
    expect(stakeholderInfo.claimedToken).to.equal(0);
  });

  it("should allow whitelisting a stakeholder", async function () {
    // Register an organization
    await vestingContract.connect(organization).registerOrganization(
      "Test Organization",
      "TO",
      "test3@example.com",
      organization.address,
      { value: transactPrice }
    );

    // Add a stakeholder
    await vestingContract.connect(organization).addStakeholder(
      stakeholder.address,
      "Stakeholder",
      1000,
      1000,
      "test4@example.com",
      1,
      { value: transactPrice }
    );
    
    // Get stakeholder info
    const stakeholderInfo = await vestingContract.stakeholders(1);

    // Whitelist the stakeholder
    await vestingContract.connect(organization).whitelistStakeholder(stakeholderInfo.id, { value: transactPrice });

    // Fetch the updated stakeholder information
    const updatedStakeholderInfo = await vestingContract.stakeholders(1);

    // Assertion
    expect(updatedStakeholderInfo.whitelisted).to.equal(true);
  });

  it("should allow a stakeholder to claim tokens after the vesting period", async function () {
    // Register an organization
    await vestingContract.connect(organization).registerOrganization(
      "Test Organization",
      "TO",
      "test5@example.com",
      organization.address,
      { value: transactPrice }
    );

    // Add a stakeholder
    await vestingContract.connect(organization).addStakeholder(
      stakeholder.address,
      "Stakeholder",
      1000,
      1000,
      "test6@example.com",
      1,
      { value: transactPrice }
    );

    // Get stakeholder info
    const stakeholderInfo = await vestingContract.stakeholders(1);

    // Whitelist the stakeholder
    await vestingContract.connect(organization).whitelistStakeholder(stakeholderInfo.id, { value: transactPrice });
    
    // Increase time to the end of the vesting period
    await ethers.provider.send("evm_increaseTime", [1001]);
    await ethers.provider.send("evm_mine");    

    // Claim tokens by the stakeholder
    await vestingContract.connect(stakeholder).claimTokens(500, stakeholderInfo.id, { value: transactPrice });

    // Check the stakeholder's token balance and claimed amount
    const tokenBalance = await vestingContract.balanceOf(stakeholder.address);

     // Fetch the updated stakeholder information
     const updatedStakeholderInfo = await vestingContract.stakeholders(1);

    // Assertions
    expect(tokenBalance).to.equal(500);
    expect(updatedStakeholderInfo.tokenAmount).to.equal(500);
    expect(updatedStakeholderInfo.claimedToken).to.equal(500);
  });
});
