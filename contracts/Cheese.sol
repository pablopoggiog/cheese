//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";
import {Types} from "../types";

contract Cheese is ERC721URIStorage {
    address private owner;
    Types.Item[] private itemsToMint;

    constructor() ERC721("CheeseNFT", "CHEESE") {
        owner = msg.sender;
    }

    function _random(string memory _input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_input)));
    }

    function mint() public {}
}
