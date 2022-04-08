// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract EventPassToken is ERC1155, Ownable, ERC1155Supply {
    uint256 eventCount = 0;
    mapping (uint256 => address) public eventCreator;
    mapping (uint256 => uint256) public eventPrice;

    constructor() ERC1155("https://eventpass.io/{id}") {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function createEvent(address eventOwner, uint256 amount, uint256 price)
        public
        returns (uint256)
    {
        console.log(msg.sender, "createEvent", eventOwner, amount);
        uint256 eventId = eventCount;
        
        _mint(eventOwner, eventId, amount, "");
        
        eventCreator[eventId] = msg.sender;
        eventPrice[eventId] = price;

        eventCount += 1;

        return eventId;
    }

    function buyPass(uint256 eventId, uint256 amount)
        public
        payable
    {
        console.log(msg.sender, "buying", eventId, amount);
        address creator = eventCreator[eventId];

        require(eventId < eventCount, "Event does not exist");
        require(balanceOf(creator, eventId) > amount, "Not enough passes available");
        require(msg.value >= eventPrice[eventId] * amount, "Not enough ETH sent");

        _safeTransferFrom(creator, msg.sender, eventId, amount, "");
    }

    function availableTickets(uint256 eventId) public view returns (uint256) {
        require(eventId < eventCount, "Event does not exist");
        return balanceOf(eventCreator[eventId], eventId);
    }

    function withdrawEarnings(uint256 eventId) public {
        require(eventId < eventCount, "Event does not exist");
        require(msg.sender == eventCreator[eventId], "Not event creator");
        Address.sendValue(payable(msg.sender), (totalSupply(eventId) - balanceOf(msg.sender, eventId)) * eventPrice[eventId]);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
