//SPDX-license-identifier : MIT
pragma solidity ^0.8.0;

// openzeppelin path inside node_modes after npm i openzeppelin
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// names after file by convetion
// It means that the tokenURIs are also stored in "storage". The base implementation in ERC721.sol
//reads the baseURI in memory and concatenates the resulting String on-the-fly,
//without storing them as a state var

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;

    // not accessible outside contract & variable defined with an underscore denotes private
    Counters.Counter private _tokenIds;

    // state variable contractAddress (have gas fees associated with them)

    address contractAddress;

    // create an instance of.... but ERC721 must run first

    constructor(address marketplaceAddress) ERC721("Toaster Tokens", "TT") {
        contractAddress = marketplaceAddress;
    }

    // hard disk - storage ( state variable change)
    // RAM : memory
    // string are expensive on blockchain gas fees

    ///@notice create a new token
    /// @param tokenURI : token URI

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        // set value to tokenId to newItemId
        uint256 newItemId = _tokenIds.current();
        // mint token with using newItemId
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI); // generate token URI
        setApprovalForAll(contractAddress, true); // grant transction permission to marketplace

        // returns token Id
        return newItemId;
    }
}
