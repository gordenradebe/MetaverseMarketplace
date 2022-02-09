//SPDX-license-identifier : MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // prevent re-entrancy attacks 

contract NFTMarket is ReentrancyGuard {
     using Counters for Counters.Counter; 

    // not accessible outside contract & variable defined with an underscore denotes private
    Counters.Counter private _itemIds;
    // total number of items sold
    Counters.Counter private _itemsSold;
   // owner receiver comission
    address payable owner;
    // Listing price: people must pay to list items on this marketplace
    uint256 listingPrice = 0.07 ether;

    constructor(){
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // access struct via mapping

    mapping(uint256 => MarketItem) private idMarketItem;
    //idMaketItem[4]


    // console.log via events

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold

    );

function getListingPrice() public view returns (uint256){
   return listingPrice;
}

function setListingPrice(uint _price) public returns(uint) {
         if(msg.sender == address(this) ){
             listingPrice = _price;
         }
         return listingPrice;
    }

function createMarketItem(address nftContract, uint256 tokenId, uint256 price) public payable nonReentrant{
    require(price > 0 , "Price cannot be zero");
    require(msg.value== listingPrice , "insufficient funds for Listing");

 // tell chain items have increased by 1
 // save itemId 
   _itemIds.increment();
   uint256 itemId = _itemIds.current();

   // update struct | access to struct uses simple brackets

   idMarketItem[itemId] = MarketItem(itemId,nftContract,tokenId,payable (msg.sender),payable(address(0)),price,false);
   IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
   emit MarketItemCreated(itemId, nftContract, tokenId, msg.sender, address(0), price, false);

}


function createMarketSale(address nftContract,
     uint256 itemId) public payable nonReentrant{
         uint256 price = idMarketItem[itemId].price;
         uint256 tokenId = idMarketItem[itemId].tokenId;

         require(msg.value== price, "Incorrect amount");

     idMarketItem[itemId].seller.transfer(msg.value);

        IERC721(nftContract).transferFrom(address(this),msg.sender , tokenId);
        idMarketItem[itemId].owner = payable(msg.sender);
        idMarketItem[itemId].sold = true;
        _itemsSold.increment();
       // uint256 itemsSold = _itemsSold.current();
       payable(owner).transfer(listingPrice);
     
    }

    ///@notice total number of items no sold
    function fetchMarketItems() public view returns (MarketItem [] memory){
        // total number of all items ever created
        uint256 itemCount =_itemIds.current();
        // check safe...integer overflow
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
         uint currentIndex =0;
        MarketItem [] memory items = new MarketItem[](unsoldItemCount);

        for (uint i= 0 ; i < itemCount; i++){

            if(idMarketItem[i+1].owner == address(0)){
                uint256 currentId = idMarketItem[i+1].itemId;
               //
                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }

        }

        return items; // line 100
    }
    ///@notice fetch list of NFT owner by user
    function fetchMyNFts() public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint256 itemCount=0;
        uint currentIndex =0;
  // ownership status and number
        for(uint i=0 ; i< totalItemCount ; i++){
            if(idMarketItem[i+1].owner == msg.sender){
                itemCount +=1; // total length of
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
          for(uint i = 0 ; i< totalItemCount ; i++){
             if(idMarketItem[i+1].owner == msg.sender){
                 uint currentId = idMarketItem[i+1].itemId;
                 MarketItem storage currentItem = idMarketItem[currentId];
                 items[currentIndex] = currentItem;
             }
          }
           return items;
    }
   

       function fetchItemsCreated() public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current();
        uint256 itemCount=0;
        uint currentIndex =0;
  // ownership status and number
        for(uint i=0 ; i< totalItemCount ; i++){
            if(idMarketItem[i+1].seller == msg.sender){
                itemCount +=1; // total length of
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
          for(uint i = 0 ; i< totalItemCount ; i++){
             if(idMarketItem[i+1].seller == msg.sender){
                 uint currentId = idMarketItem[i+1].itemId;
                 MarketItem storage currentItem = idMarketItem[currentId];
                 items[currentIndex] = currentItem;
             }
          }
           return items;
    }

//total spent
}