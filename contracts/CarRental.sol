// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Car Rental with USDFC Payments
/// @notice Handles NFT minting, listing, rentals, and USDFC-based payments
contract CarRental is ERC721, Ownable {
    // Stablecoin used for all payments (USDFC)
    IERC20 public immutable usdfc;
    // Fee to pay for listing storage (one-time per car)
    uint256 public listingFee;

    struct RentalInfo {
        address renter;
        uint256 startTime;
        uint256 duration;
        string[] logCIDs; // IPFS/Filecoin CIDs
    }

    // carId == tokenId
    mapping(uint256 => RentalInfo) public rentals;
    mapping(uint256 => string) private _tokenURIs; // metadata CIDs
    mapping(uint256 => uint256) public pricePerDay;
    mapping(uint256 => bool) public listed;

    event CarMinted(uint256 indexed carId, address indexed owner, string metadataCID);
    event CarListed(uint256 indexed carId, address indexed owner, uint256 pricePerDay);
    event CarRented(uint256 indexed carId, address indexed renter, uint256 duration, uint256 totalFee);
    event LogUploaded(uint256 indexed carId, string cid);
    event StoragePaid(uint256 indexed carId, address indexed payer, uint256 amount);

    constructor(address _usdfc, uint256 _listingFee) ERC721("PeerCar", "PCAR") {
        usdfc = IERC20(_usdfc);
        listingFee = _listingFee;
    }

    /// @notice Mint a new car NFT with metadata CID
    function mintCar(uint256 carId, string memory metadataCID) external {
        require(!_exists(carId), "Car already minted");
        _mint(msg.sender, carId);
        _setTokenURI(carId, metadataCID);
        emit CarMinted(carId, msg.sender, metadataCID);
    }

    /// @notice List a minted car for rent, pay listing storage fee
    /// @param carId The token ID of the car
    /// @param _pricePerDay Rental price per day in USDFC's smallest unit
    function listCar(uint256 carId, uint256 _pricePerDay) external {
        require(ownerOf(carId) == msg.sender, "Not NFT owner");
        require(!listed[carId], "Already listed");
        // Pay listing storage fee
        require(usdfc.transferFrom(msg.sender, address(this), listingFee), "Listing payment failed");

        pricePerDay[carId] = _pricePerDay;
        listed[carId] = true;
        emit StoragePaid(carId, msg.sender, listingFee);
        emit CarListed(carId, msg.sender, _pricePerDay);
    }

    /// @notice Rent a listed car, paying rental fee
    /// @param carId The token ID of the car
    /// @param duration Number of days to rent
    function rentCar(uint256 carId, uint256 duration) external {
        require(listed[carId], "Car not listed");
        require(rentals[carId].renter == address(0), "Already rented");
        uint256 totalFee = pricePerDay[carId] * duration;
        require(usdfc.transferFrom(msg.sender, address(this), totalFee), "Payment failed");

        rentals[carId] = RentalInfo({
            renter: msg.sender,
            startTime: block.timestamp,
            duration: duration,
            logCIDs: new string[](0)
        });
        emit CarRented(carId, msg.sender, duration, totalFee);
    }

    /// @notice Upload a log CID for an active rental
    function uploadLog(uint256 carId, string calldata cid) external {
        require(rentals[carId].renter == msg.sender, "Only renter can upload logs");
        rentals[carId].logCIDs.push(cid);
        emit LogUploaded(carId, cid);
    }

    /// @notice View all log CIDs for a car
    function getLogs(uint256 carId) external view returns (string[] memory) {
        return rentals[carId].logCIDs;
    }

    /// @notice Withdraw accumulated USDFC (rental + listing fees)
    function withdraw(address to, uint256 amount) external onlyOwner {
        require(usdfc.transfer(to, amount), "Withdraw failed");
    }

    /// @dev Internal: set metadata URI
    function _setTokenURI(uint256 tokenId, string memory _cid) internal {
        _tokenURIs[tokenId] = _cid;
    }

    /// @notice Override ERC721 tokenURI to return stored CID
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }
}
