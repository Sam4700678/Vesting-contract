// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// imports
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Compile contracts (optional if already compiled)
  await hre.run('compile');

  // Deploy the Contract
  const Vesting = await hre.ethers.getContractFactory('Vesting');
  const vesting = await Vesting.deploy('Token', 'TKN');
  await vesting.deployed();
  console.log('Vesting contract deployed to:', vesting.address);

  fs.writeFileSync(
    './src/contexts/contractAddress.js', 
  `export const vestingAddress = '${vesting.address}';`
  );

  console.log('Contract address exported successfully.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });