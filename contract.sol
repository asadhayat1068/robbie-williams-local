// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RobbieWilliamsEvent is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    struct Ticket {
        uint256 ticketClass;
        uint256 ticketNumber;
        string holder;
        string holderEmail;
    }

    mapping(uint256 => uint256) public maxSeats;
    mapping(uint256 => uint256) public reservedSeats;
    mapping(uint256 => Ticket) public idToTicket;

    constructor() ERC721("RobbieWilliamsEvent", "TICKET") {}

    function safeMint(
        address to,
        uint256 classId,
        uint256 ticketNumber,
        string calldata holder,
        string calldata holderEmail
    ) public onlyOwner {
        require(maxSeats[classId] != 0, "Invalid Class ID.");
        require(reservedSeats[classId] < maxSeats[classId], "No more seats available");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        Ticket memory ticket;
        ticket.ticketClass = classId;
        ticket.ticketNumber = ticketNumber;
        ticket.holder = holder;
        ticket.holderEmail = holderEmail;
        idToTicket[tokenId] = ticket;
        reservedSeats[classId]++;
    }

    function setTicketClass(uint256 _classId, uint256 _maxSeats) external {
        require(maxSeats[_classId] == 0, "Class ID already assigned.");
        maxSeats[_classId] = _maxSeats;
    }

    function name(uint256 id) public view returns (string memory) {
        return idToTicket[id].holder;
    }

    function email(uint256 id) public view returns (string memory) {
        return idToTicket[id].holderEmail;
    }
    
    function class(uint256 id) public view returns (uint256) {
        return idToTicket[id].ticketClass;
    }
    
    function number(uint256 id) public view returns (uint256) {
        return idToTicket[id].ticketNumber;
    }
}