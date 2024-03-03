'use client';
import Vesting from './Vesting.json';
import { vestingAddress } from './contractAddress';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

const shortenAddress = (strAddress) => {
    return strAddress.slice(0, 3) + "..." + strAddress.slice(-4)
};

const formatPercentage = (amt) => {
    return amt.toLocaleString(undefined, {
        style: "percent",
        minimumFractionDigits: 0,
    });
};

const connectContract = async () => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        // const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com');
        // const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(vestingAddress, Vesting.abi, signer);
        return contract;
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

const getTransactPrice = async () => {
    try {
        const contract = await connectContract();
        const price = await contract.getTransactPrice();
        return price;
    }
    catch (error) {
        throw new Error("Error", error);
    }
}

const signUp = async (
    name,
    symbol,
    email,
    orgAddress) => {
    try {
        const contract = await connectContract();
        let price = await getTransactPrice();
        price = price.toString();
        const register = await contract.registerOrganization(name, symbol, email, orgAddress, { value: price });
        const receipt = await register.wait();
        if (receipt.status === 1) {
            return true;
        }
        console.log(`Transaction hash: ${register.hash}`);
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

const signIn = async (email) => {
    try {
        const contract = await connectContract();
        const accountType = await contract.signin(email);
        return accountType;
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

const addStakeholder = async (
    stakeholderAddress,
    role,
    endTime,
    tokenAmount,
    email,
    orgId
) => {
    try {
        let price = await getTransactPrice();
        price = price.toString();
        const contract = await connectContract();
        const stakeholder = await contract.addStakeholder(
            stakeholderAddress,
            role,
            endTime,
            tokenAmount,
            email,
            orgId,
            { value: price }
        );
        const receipt = await stakeholder.wait();
        if (receipt.status === 1) {
            return true;
        }
        console.log(`Transaction hash: ${stakeholder.hash}`);
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

const whitelist = async (userId) => {
    try {
        let price = await getTransactPrice();
        price = price.toString();
        const contract = await connectContract();
        const whitelistUser = await contract.whitelistStakeholder(userId, { value: price });
        const receipt = await whitelistUser.wait();
        if (receipt.status === 1) {
            return true;
        }
        console.log(`Transaction hash: ${whitelistUser.hash}`);
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

const claimToken = async (amount, userId) => {
    try {
        let price = await getTransactPrice();
        price = price.toString();
        const contract = await connectContract();
        const claim = await contract.claimTokens(amount, userId, { value: price });
        const receipt = await claim.wait();
        if (receipt.status === 1) {
            return true;
        }
        console.log(`Transaction hash: ${claim.hash}`);
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

const getId = async (address) => {
    try {
        const contract = await connectContract();
        const id = await contract.address_to_id(address);
        return id;
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

const getUser = async (userId) => {
    try {
        const contract = await connectContract();
        const user = await contract.stakeholders(userId);
        const token = parseInt(user.tokenAmount);
        const claimed = parseInt(user.claimedToken);
        const total = token + claimed;
        const userData = {
            id: parseInt(user.id),
            orgId: parseInt(user.orgId),
            role: user.role,
            tokenAmount: token,
            claimedToken: claimed,
            totalToken: total,
            startDate: parseInt(user.startTime),
            vestEnd: parseInt(user.endTime),
            whitelisted: user.whitelisted
        }
        return userData;
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

const getUserOrg = async (orgId) => {
    try {
        const contract = await connectContract();
        const org = await contract.organizations(orgId);
        const orgData = {
            name: org.name,
            symbol: org.symbol
        }
        return orgData;
        console.log(orgData);
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

const verifyUser = async (userId, userAddress) => {
    try {
        const contract = await connectContract();
        const user = await contract.stakeholders(userId);
        if (user.userAddress == userAddress) {
            return true;
        }
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

const getOrg = async (orgId) => {
    try {
        const contract = await connectContract();
        const org = await contract.organizations(orgId);
        const orgData = {
            tokenName: org.name,
            tokenSymbol: org.symbol
        }
        return orgData;
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

const verifyOrg = async (orgId, orgAddress) => {
    try {
        const contract = await connectContract();
        const org = await contract.organizations(orgId);
        if (org.orgAddress == orgAddress) {
            return true;
        }
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

const getOrgStakeholders = async (orgId) => {
    try {
        const contract = await connectContract();
        const orgUsers = await contract.orgStakeholders(orgId);
        let orgStakeholders = [];
        for (let i = 0; i < orgUsers.length; i++) {
            const user = await contract.stakeholders(orgUsers[i]);
            const token = parseInt(user.tokenAmount);
            const claimed = parseInt(user.claimedToken);
            const total = token + claimed;
            orgStakeholders.push({
                id: parseInt(user.id),
                role: user.role,
                address: user.userAddress,
                tokenAmount: token,
                claimedToken: claimed,
                totalToken: total,
                whitelisted: user.whitelisted
            });
        }
        return orgStakeholders;
    }
    catch (error) {
        throw new Error("Error", error);
    }
};

// const getAddress = async () => {
//     try {
//         const contract = await connectContract();
//         const signer = await contract.signer.getAddress();
//         console.log(signer);
//         return signer;
//     }
//     catch (err) {
//         throw new Error("Error", error);
//     }
// };

export {
    shortenAddress,
    formatPercentage,
    connectContract,
    signUp,
    signIn,
    addStakeholder,
    whitelist,
    claimToken,
    getId,
    getUser,
    getUserOrg,
    verifyUser,
    getOrg,
    verifyOrg,
    getOrgStakeholders
};