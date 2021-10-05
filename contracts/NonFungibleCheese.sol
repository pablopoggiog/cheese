//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

contract NonFungibleCheese is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address private owner;

    struct Item {
        string name;
        string description;
        string image;
        string color;
    }

    Item[] private itemsToMint;

    mapping(uint256 => Item) public mintedItems;

    constructor() ERC721("NonFungibleCheese", "CHEESE") {
        owner = msg.sender;
    }

    event ItemAdded(
        string title,
        string description,
        string image,
        string color,
        uint256 timestamp
    );
    event ItemMinted(address by, uint256 tokenId, uint256 timestamp);

    modifier ownerOnly() {
        require(msg.sender == owner, "Only available for the owner");
        _;
    }

    function _random(string memory _input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_input)));
    }

    function addNewItems(Item[] calldata newItems) public ownerOnly {
        for (uint256 i; i < newItems.length; i++) {
            itemsToMint.push(newItems[i]);

            emit ItemAdded(
                newItems[i].name,
                newItems[i].description,
                newItems[i].image,
                newItems[i].color,
                block.timestamp
            );

            console.log("name %s and description: %s", newItems[i].name, newItems[i].description);
        }
    }

    function _getEncodedUrl(
        string memory name,
        string memory description,
        string memory image,
        string memory color
    ) internal pure returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        name,
                        '", "description": "',
                        description,
                        '", "image": "',
                        image,
                        '", "color": "',
                        color,
                        '"}'
                    )
                )
            )
        );
        string memory encodedUrl = string(abi.encodePacked("data:application/json;base64,", json));
        return encodedUrl;
    }

    function _pickItemToMint(uint256 _itemIndex) internal returns (Item memory) {
        Item memory pickedItem = itemsToMint[_itemIndex];

        // workaround to remove the chosen element
        itemsToMint[_itemIndex] = itemsToMint[itemsToMint.length - 1];
        itemsToMint.pop();

        return pickedItem;
    }

    function _pickRandomItemToMint(uint256 newItemId) internal returns (Item memory) {
        uint256 randomIndex = _random(
            string(abi.encodePacked(block.number, block.timestamp, msg.sender, newItemId))
        ) % itemsToMint.length;

        Item memory item = _pickItemToMint(randomIndex);

        return item;
    }

    function mint() public {
        require(itemsToMint.length > 0, "There are no items available");

        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);

        mintedItems[newTokenId] = _pickRandomItemToMint(newTokenId);

        _tokenIds.increment();

        emit ItemMinted(msg.sender, newTokenId, block.timestamp);
    }
}
