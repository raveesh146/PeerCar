// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarRental is ERC721, Ownable {
    struct RentalInfo {
        address renter;
        uint256 startTime;
        uint256 duration;
        string[] logCIDs; // IPFS/Filecoin CIDs
    }

    // carId == tokenId
    mapping(uint256 => RentalInfo) public rentals;
    mapping(uint256 => string) private _tokenURIs; // metadata CIDs

    event CarMinted(uint256 carId, address owner, string metadataCID);
    event CarListed(uint256 carId, address owner);
    event CarRented(uint256 carId, address renter, uint256 duration);
    event LogUploaded(uint256 carId, string cid);

    constructor() ERC721("PeerCar", "PCAR") {}

    // Mint a new car NFT with metadata CID
    function mintCar(uint256 carId, string memory metadataCID) external {
        require(!_exists(carId), "Car already minted");
        _mint(msg.sender, carId);
        _setTokenURI(carId, metadataCID);
        emit CarMinted(carId, msg.sender, metadataCID);
    }

    // Set the token URI (metadata CID)
    function _setTokenURI(uint256 tokenId, string memory _cid) internal {
        _tokenURIs[tokenId] = _cid;
    }

    // Return the token URI (metadata CID)
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    // List a car for rent (must be NFT owner)
    function listCar(uint256 carId) external {
        require(ownerOf(carId) == msg.sender, "Not NFT owner");
        emit CarListed(carId, msg.sender);
    }

    // Rent a car
    function rentCar(uint256 carId, uint256 duration) external {
        require(_exists(carId), "Car not minted");
        require(rentals[carId].renter == address(0), "Already rented");
        rentals[carId] = RentalInfo({
            renter: msg.sender,
            startTime: block.timestamp,
            duration: duration,
            logCIDs: new string[](0)
        });
        emit CarRented(carId, msg.sender, duration);
    }

    // Upload a log (CID) for a rental
    function uploadLog(uint256 carId, string calldata cid) external {
        require(rentals[carId].renter == msg.sender, "Only renter can upload logs");
        rentals[carId].logCIDs.push(cid);
        emit LogUploaded(carId, cid);
    }

    // View logs for a car
    function getLogs(uint256 carId) external view returns (string[] memory) {
        return rentals[carId].logCIDs;
    }
}
