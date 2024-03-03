# Vest

This smart contract provides a functionality for organizations to establish a vesting schedule for their tokens. It allows organizations to register themselves, define the stakeholders involved and their respective vesting periods. The contract also enables the whitelisting of addresses and facilitates the claiming of tokens once the vesting period has elapsed.

## Getting Started

Download the codes by downloading the entire repository, in the project directory,  run the following command to install the dependencies:

```shell
 npm install
```

To deploy the contract, setup your `.env` file by renaming the `.env.example` file to `.env`, paste your wallet private key where necessary and run the following command:

```shell
npx hardhat run scripts/deploy.js --network mumbai
```

To start the project, run the following command:

```shell
npm run dev
```

To test the smart contract, run the following command:

```shell
npx hardhat test 
```

## License

This project is licensed under the [MIT License](LICENSE).

## Disclaimer

This project is but an example project, it is not for the purpose of commercial use.
