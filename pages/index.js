//import '../styles/globals.css';
import Header from '../components/Header';
import {useEffect, useState} from 'react';
import axios from 'axios';
import Web3modal from 'web3modal';
//import styles from '../styles/Home.module.css'
import { nftaddress , nftmarketaddress } from '../config';
import Head from "next/head";
//import Header from "../components/Header"
import { ethers } from 'ethers'; 
import Image from 'next/image'


// import contract 
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
//import Card from '../components/Card';

export default function Home() {
  const [nfts , setNfts] =useState([]);
  const [loadingState , setLoadingState] = useState('no-loading');

  useEffect(()=>{
      loadNfts()
  },)

  async function loadNfts(){
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftaddress,NFT.abi,provider);
    const nftmarketContract = new ethers.Contract(nftmarketaddress,NFTMarket.abi,provider);
    
    const data = await nftmarketContract.fetchMarketItems() 
    // now we engage with functions in SC
    const items = await Promise.all(data.map(async i =>{
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      
    // price via etherjs

    let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

    let item = {
      price,
      tokenId: i.tokenId.toNumber(),
      seller : i.seller,
      owner : i.owner,
      // tokenUri
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description

    }
    return item;
    }))

    setNfts(items);
    setLoadingState('loaded');
  }

  async function buyNFTs(nft){

      const web3Modal = new Web3modal();
      const connection = await web3Modal.connect();
      //Check 
      const provider = new ethers.providers.Web3Provider(connection)

      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer);

      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

         //make the sale
      const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    });
    await transaction.wait();

    loadNFTs()

    console.log(nft.name)

  }

 /* if(loadingState === 'loaded' && nfts.length) return(

    <div className="sticky z-50  top-0 ">
    <Header />
    <h1 className="px-20 py-20 text-3xl">No items in the market place</h1>
  
    </div> 
    
  )*/
  return (
    <div >
       <div >
          <Head>
             <title>Toaster Market</title>
             <link rel="icon" href="/favicon.ico"/>
          </Head>

          <Header/>

          <div className="flex justify-center">
     <div className="px-4" style={{ maxWidth: '1600px'}}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {
          nfts.map((nft, i) =>(
            <div key={i} className="border shadow rounded-xl overflow-hidden">
             
              <Image
                  src={nft.image}
                  alt="Picture of the author"
                  width={500}
                  height={500}
                  // blurDataURL="data:..." automatically provided
                  // placeholder="blur" // Optional blur-up while loading
                />
                        <div className="p-4">
                <p style={{ height: '64px'}} className="inline-block px-3 py-6 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                  {nft.name}

                </p>
                <div style={{ height: '70px', overflow: 'hidden'}}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-300">
                <p className="text-2xl mb-4 font-bold text-black">
                  Price : {nft.price} ETH
                </p>
                <button className="w-full bg-orange-300 text-pink-700 font-bold py-2 px-12 rounded"
                onClick={() => buyNFTs(nft)}>BUY NFT</button>
            </div>
            </div>
          ))
        }
      </div>
     </div>
   </div>
      
       </div>
        </div>
  )
}
