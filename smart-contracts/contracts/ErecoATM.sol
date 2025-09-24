// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ErecoATM {
    address public owner;
    address public platformWallet;
    IERC20 public usdcToken;

    struct CardData {
        bool isLinked;
        bool isDisabled;
        uint256 spendLimit; // 0 means unlimited access
        string last4Digits;
        uint256 expiry; // UNIX timestamp when card will expire
    }

    mapping(address => CardData) public cardDetails;

    event CardLinked(address indexed user, string last4Digits, uint256 expiry);
    event CardDisabled(address indexed user);
    event CardDeleted(address indexed user);
    event SpendLimitUpdated(address indexed user, uint256 newLimit);
    event USDCWithdrawn(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _platformWallet, address _usdcToken) {
        owner = msg.sender;
        platformWallet = _platformWallet;
        usdcToken = IERC20(_usdcToken);
    }

    function linkCard(string calldata _last4, uint256 _expiryTimestamp) external {
        require(!cardDetails[msg.sender].isLinked, "Card already linked");

        cardDetails[msg.sender] = CardData({
            isLinked: true,
            isDisabled: false,
            spendLimit: 0,
            last4Digits: _last4,
            expiry: _expiryTimestamp
        });

        emit CardLinked(msg.sender, _last4, _expiryTimestamp);
    }

    function disableCard() external {
        require(cardDetails[msg.sender].isLinked, "Card not linked");
        cardDetails[msg.sender].isDisabled = true;
        emit CardDisabled(msg.sender);
    }

    function deleteCard() external {
        require(cardDetails[msg.sender].isLinked, "Card not linked");
        delete cardDetails[msg.sender];
        emit CardDeleted(msg.sender);
    }

    function setSpendLimit(uint256 _limit) external {
        require(cardDetails[msg.sender].isLinked, "Card not linked");
        cardDetails[msg.sender].spendLimit = _limit;
        emit SpendLimitUpdated(msg.sender, _limit);
    }

    function withdrawUSDC(address user, uint256 amount) external onlyOwner returns (bool) {
        CardData storage card = cardDetails[user];

        require(card.isLinked && !card.isDisabled, "Card inactive");

        // Check card expiration
        require(block.timestamp <= card.expiry, "Card expired");

        uint256 allowedLimit = card.spendLimit > 0 ? card.spendLimit : usdcToken.balanceOf(user);
        require(amount <= allowedLimit, "Exceeds spend limit");

        require(usdcToken.allowance(user, address(this)) >= amount, "Insufficient allowance");
        require(usdcToken.balanceOf(user) >= amount, "Insufficient balance");

        bool success = usdcToken.transferFrom(user, platformWallet, amount);
        require(success, "USDC transfer failed");

        emit USDCWithdrawn(user, amount);
        return true;
    }

    function getCardData(address user) external view returns (
        bool linked,
        bool disabled,
        uint256 limit,
        string memory last4,
        uint256 expiry
    ) {
        CardData memory card = cardDetails[user];
        return (card.isLinked, card.isDisabled, card.spendLimit, card.last4Digits, card.expiry);
    }
}
