// SPDX-License-Identifier: MIT

// Solidity version required for the contract
pragma solidity ^0.8.9;

// Importing necessary OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Vesting contract that extends ERC20 token functionality and uses ReentrancyGuard to prevent reentrancy attacks
contract Vesting is ERC20, ReentrancyGuard {
    using SafeMath for uint256; // SafeMath library for safe arithmetic operations

    // Mapping of account's email with account's wallet address
    mapping(string => address) public email_to_address;

    // Mapping of wallet address with account id
    mapping(address => uint256) public address_to_id;

    // Mapping of wallet address with bool representing account status (Organization/individual)
    mapping(address => bool) public is_organization;

    address payable owner; // Owner of the contract

    uint256 transactPrice = 0.0001 ether; // Transaction price for various contract functions

    // Structure representing an Organization
    struct Organization {
        address orgAddress;
        uint256 id;
        string name;
        string symbol;
        uint256[] stakeholders; // Array of stakeholder IDs associated with the organization
    }

    // Structure representing a Stakeholder
    struct Stakeholder {
        uint256 id;
        uint256 orgId;
        address userAddress;
        string role;
        uint256 endTime;
        uint256 startTime;
        uint256 tokenAmount;
        uint256 claimedToken;
        bool whitelisted;
    }

    // Arrays holding the data for all organizations and stakeholders
    Organization[] public organizations;
    Stakeholder[] public stakeholders;

    event CreatedStakeholder(uint256 startTime, uint256 vestingPeriod);

    // Constructor initializing the contract with the given name and symbol
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        owner = payable(msg.sender); // Set the contract deployer as the owner
    }

    // Function to get the current transaction price
    function getTransactPrice() public view returns (uint256) {
        return transactPrice;
    }

    // Function to register a new organization
    function registerOrganization(
        string memory name,
        string memory symbol,
        string calldata email,
        address orgAddress
    ) public payable nonReentrant {
        require(msg.value == transactPrice, "Price must be equal to transaction price");
        require(
            email_to_address[email] == address(0),
            "Error: Account already exists!"
        );

        if (organizations.length == 0) {
            organizations.push(); // Add a dummy element at index 0
        }

        Organization memory org = Organization({
            orgAddress: orgAddress,
            id: organizations.length,
            name: name,
            symbol: symbol,
            stakeholders: new uint256[](0)
        });

        organizations.push(org);
        email_to_address[email] = orgAddress;
        address_to_id[orgAddress] = org.id;
        is_organization[orgAddress] = true;

        // Transfer the transaction fee to the contract owner
        owner.transfer(transactPrice);
    }

    // Function to add a new stakeholder to an organization
    function addStakeholder(
        address _stakeholderAddress,
        string memory _role,
        uint256 _endTime,
        uint256 _tokenAmount,
        string memory email,
        uint256 _orgId
    ) public payable nonReentrant {
        require(msg.value == transactPrice, "Price must be equal to transaction price");
        require(is_organization[msg.sender], "Unauthorized");
        require(
            _orgId < organizations.length,
            "Error: Organization does not exist"
        );
        require(
            email_to_address[email] == address(0),
            "Error: Account already exists!"
        );

        if (stakeholders.length == 0) {
            stakeholders.push(); // Add a dummy element at index 0
        }

        Stakeholder memory user = Stakeholder({
            id: stakeholders.length,
            orgId: _orgId,
            userAddress: _stakeholderAddress,
            role: _role,
            endTime: _endTime,
            startTime: block.timestamp,
            tokenAmount: _tokenAmount,
            claimedToken: 0,
            whitelisted: false
        });

        stakeholders.push(user);
        email_to_address[email] = _stakeholderAddress;
        address_to_id[_stakeholderAddress] = user.id;

        organizations[_orgId].stakeholders.push(user.id);

        emit CreatedStakeholder(block.timestamp, _endTime);

        // Transfer the transaction fee to the contract owner
        owner.transfer(transactPrice);
    }

    // Function to list current employees of an organization
    function orgStakeholders(uint256 id)
        public
        view
        returns (uint256[] memory)
    {
        return organizations[id].stakeholders;
    }

    // Function to determine the type of the calling account (organization or stakeholder)
    function signin(string calldata email) public view returns (string memory accountType) {
        require(
            msg.sender == email_to_address[email],
            "Error: Incorrect wallet address used for signing in"
        );

        if (is_organization[msg.sender]) {
            accountType = "organization";
        } else {
            accountType = "stakeholder";
        }

        return accountType;
    }

    // Function to whitelist a stakeholder by an organization
    function whitelistStakeholder(uint256 stakeholderId) external payable nonReentrant {
        require(msg.value == transactPrice, "Price must be equal to transaction price");
        require(is_organization[msg.sender], "Only organization can perform this action");
        require(
            stakeholders[stakeholderId].orgId == address_to_id[msg.sender],
            "Error: User is not of the same organization"
        );

        stakeholders[stakeholderId].whitelisted = true;

        // Transfer the transaction fee to the contract owner
        owner.transfer(transactPrice);
    }

    // Function to allow a stakeholder to claim vested tokens after the vesting period
    function claimTokens(uint256 amount, uint256 userId) public payable nonReentrant {
        require(msg.value == transactPrice, "Price must be equal to transaction price");
        require(stakeholders[userId].whitelisted == true, "You are not whitelisted");
        require(
            block.timestamp >= stakeholders[userId].endTime,
            "Vesting period not over"
        );
        require(
            stakeholders[userId].tokenAmount >= amount,
            "You can't claim more tokens than was vested"
        );

        _mint(msg.sender, amount);
        stakeholders[userId].tokenAmount -= amount;
        stakeholders[userId].claimedToken += amount;

        // Transfer the transaction fee to the contract owner
        owner.transfer(transactPrice);
    }
}