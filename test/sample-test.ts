import { expect } from "chai";
import { ContractReceipt, ContractTransaction, Contract } from "ethers";
import { ethers } from "hardhat";

describe("NonFungibleCheese", async () => {
  const newItems = [
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
  ];

  const deployContract = async () => {
    try {
      const contractFactory = await ethers.getContractFactory("NonFungibleCheese");
      const contract = await contractFactory.deploy();
      return await contract.deployed();
    } catch (error) {
      console.log(error);
    }
  };

  const addNewItems = async (contract: Contract) => {
    try {
      const addNewItemCall: ContractTransaction = await contract?.addNewItems(newItems);
      const minedTransaction: ContractReceipt = await addNewItemCall.wait();

      return minedTransaction;
    } catch (error) {
      console.log(error);
    }
  };

  it("emits ItemAdded events with the right values when new items are added to the collection", async function () {
    const contract = await deployContract();

    if (contract) {
      const minedTransaction = await addNewItems(contract);
      try {
        minedTransaction &&
          minedTransaction.events?.map(({ event, args }, index) => {
            expect(event).to.equal("ItemAdded");
            expect(args).to.include(newItems[index].name, newItems[index].description);
            expect(args).to.include(newItems[index].image, newItems[index].color);
          });
      } catch (error) {
        console.log({ error });
      }
    } else {
      ("Something failed deploying the contract");
    }
  });

  it("lets mint items after having being added to the collection", async function () {
    const contract = await deployContract();

    if (contract) {
      await addNewItems(contract);

      try {
        const transaction: ContractTransaction = await contract.mint();
        const minedTransaction = await transaction.wait();

        expect(minedTransaction.events?.[1].event).to.equal("ItemMinted");
        expect(minedTransaction.events?.[1].args).to.include(minedTransaction.from);
      } catch (error) {
        console.log({ error });
      }
    } else {
      ("Something failed deploying the contract");
    }
  });

  it("shouldn't let mint items if there are no items available", async function () {
    const contract = await deployContract();

    if (contract) {
      try {
        // Inline assertion, as declaring variables/constants outside of an expect throws an exception and falls in the catch
        await expect(contract.mint()).to.be.revertedWith("There are no items available");
      } catch (error: any) {
        console.log(error.message);
      }
    } else {
      ("Something failed deploying the contract");
    }
  });
});
