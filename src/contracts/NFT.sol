// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// NFT contract that inherits from ERC721URIStorage
contract NFT is ERC721URIStorage {
    // A variable to keep track of the total number of tokens minted
    uint public tokenCount;

    // Constructor to initialize the contract with a name and symbol
    constructor() ERC721("My NFT", "MFT") {}

    // Function to mint a new NFT with a given tokenURI
    function mint(string memory _tokenURI) external returns (uint) {
        // Increment the token count
        tokenCount++;

        // Mint a new token for the sender with the current count
        _safeMint(msg.sender, tokenCount);

        // Set the token's URI for metadata
        _setTokenURI(tokenCount, _tokenURI);

        // Return the ID of the newly minted token
        return tokenCount;
    }
}
