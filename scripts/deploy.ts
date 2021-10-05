import { ethers, run } from "hardhat";

async function main() {
  const nftContractFactory = await ethers.getContractFactory("NonFungibleCheese");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();

  console.log("Contract deployed to:", nftContract.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
