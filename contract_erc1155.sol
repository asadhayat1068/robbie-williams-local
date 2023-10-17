// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract MyToken is ERC1155, Ownable, ERC1155Burnable {
    address public vault;

    mapping(uint => string) public TokenClass;

    constructor(
        address _initialOwner,
        address _valut
    ) ERC1155("RobbieWilliams") Ownable(_initialOwner) {
        vault = _valut;
    }

    function addTokenClass(
        uint256 id,
        string memory classDescription
    ) external onlyOwner {
        TokenClass[id] = classDescription;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        require(
            keccak256(abi.encodePacked(TokenClass[id])) !=
                keccak256(abi.encodePacked("")),
            "Token id not defined"
        );
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        for (uint256 i = 0; i < ids.length; i++) {
            require(
                keccak256(abi.encodePacked(TokenClass[ids[i]])) !=
                    keccak256(abi.encodePacked("")),
                "Token id not defined"
            );
        }
        _mintBatch(to, ids, amounts, data);
    }

    function OwnerSafeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes memory data
    ) external onlyOwner {
        _safeTransferFrom(from, to, id, value, data);
    }

    function OwnerSafeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) external onlyOwner {
        _safeBatchTransferFrom(from, to, ids, values, data);
    }

    function OwnerLockToken(
        address from,
        uint256 id,
        uint256 value,
        bytes memory data
    ) external onlyOwner {
        _safeTransferFrom(from, vault, id, value, data);
    }

    function OwnerBatchLockTokens(
        address from,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) external onlyOwner {
        _safeBatchTransferFrom(from, vault, ids, values, data);
    }
}
