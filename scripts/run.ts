import hre from "hardhat";

const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("NonFungibleCheese");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // Add 2 new items
  let addNewItemTxn = await nftContract.addNewItems([
    {
      name: "Parmesan",
      description: "Savory and salty cheese",
      image: "https://pablopoggiog.github.io/eneftees/static/media/honest-work.ad914397.jpg",
      color: "red",
    },
    {
      name: "Sardo",
      description: "Pretty cool for picadas",
      image: "https://pablopoggiog.github.io/eneftees/static/media/honest-work.ad914397.jpg",
      color: "blue",
    },
  ]);

  // Wait for it to be mined
  await addNewItemTxn.wait();

  // Mint the 1st one
  let txn = await nftContract.mint();
  await txn.wait();

  // Mint the 2nd one
  txn = await nftContract.mint();
  await txn.wait();
};

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
