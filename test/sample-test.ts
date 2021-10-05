import { expect } from "chai";
import { ContractReceipt, ContractTransaction } from "ethers";
import { ethers } from "hardhat";

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

describe("NonFungibleCheese", function () {
  it("emits ItemAdded events with the right values when new items are added to the collection", async function () {
    const contractFactory = await ethers.getContractFactory("NonFungibleCheese");
    const contract = await contractFactory.deploy();
    await contract.deployed();

    const addNewItemCall: ContractTransaction = await contract.addNewItems(newItems);

    const minedTransaction: ContractReceipt = await addNewItemCall.wait();

    minedTransaction.events?.map(({ event, args }, index) => {
      expect(event).to.equal("ItemAdded");
      expect(args).to.include(newItems[index].name, newItems[index].description);
      expect(args).to.include(newItems[index].image, newItems[index].color);
    });
  });
});
