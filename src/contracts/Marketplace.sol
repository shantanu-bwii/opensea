// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Marketplace contract with the ability to buy and sell NFTs
contract Marketplace is ReentrancyGuard {
    address payable public feeAccount;
    uint public immutable feePercentage;
    uint public itemCount;

    // Struct to represent an item available in the marketplace
    struct Item {
        uint itemID;             // Unique identifier for the item
        IERC721 nft;             // ERC721 contract address of the NFT
        uint tokenID;            // Token ID of the NFT
        uint price;              // Price of the item
        address payable seller;  // Seller's address
        bool sold;               // Flag to indicate if the item has been sold
    }

    // Mapping to store items by their unique IDs
    mapping(uint => Item) public items;

    // Event emitted when an item is offered for sale
    event Offered(
        uint itemID,
        address indexed nft,
        uint tokenID,
        uint price,
        address indexed seller
    );

    // Event emitted when an item is bought
    event Bought(
        uint itemID,
        address indexed nft,
        uint tokenID,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    // Constructor to initialize the marketplace with a fee account and percentage
    constructor(uint _feePercentage) {
        feeAccount = payable(msg.sender);
        feePercentage = _feePercentage;
    }

    // Function to add an item to the marketplace
    function makeItem(IERC721 _nft, uint _tokenID, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than 0");

        itemCount++;

        _nft.transferFrom(msg.sender, address(this), _tokenID);

        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenID,
            _price,
            payable(msg.sender),
            false
        );

        emit Offered(itemCount, address(_nft), _tokenID, _price, msg.sender);
    }

    // Function to purchase an item from the marketplace
    function purchaseItem(uint _itemID) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemID);
        Item storage item = items[_itemID];
        require(_itemID > 0 && _itemID <= itemCount, "Item doesn't exist");
        require(msg.value == _totalPrice, "Only full payment allowed");
        require(!item.sold, "Item already sold");

        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);

        item.sold = true;

        item.nft.transferFrom(address(this), msg.sender, item.tokenID);

        emit Bought(_itemID, address(item.nft), item.tokenID, item.price, item.seller, msg.sender);
    }

    // Function to calculate the total price of an item including fees
    function getTotalPrice(uint _itemID) view public returns (uint) {
        return ((items[_itemID].price * (100 + feePercentage)) / 100);
    }
}
