// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract QuizReward is ERC721, Ownable {
    uint256 public tokenIdCounter;
    mapping(address => bool) public rewarded;


    constructor() ERC721("QuizReward", "QRD") Ownable(msg.sender) {}

    function rewardUser(address user) external onlyOwner {
        require(!rewarded[user], "User already rewarded");
        rewarded[user] = true;
        _safeMint(user, tokenIdCounter);
        tokenIdCounter++;
    }
}
