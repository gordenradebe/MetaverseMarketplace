import Link from 'next/link';
import Image from 'next/image';
//const logo = require('../assets/logo.png');

import logo from '../assets/logo.png'
import  { SearchIcon, HomeIcon, BriefcaseIcon, PlusCircleIcon } from '@heroicons/react/solid';



function Header() {
    return (
        <nav className="sticky z-50  top-0 grid grid-cols-3 bg-white shadow-md py-5 px-5 md:px-10">
          
              {/** left div */}

              <div  className="relative flex items-center h-10 my-auto">
                  <Image src={logo} 
                   layout="fill"
                   objectFit='contain'
                   objectPosition='left'
                  className="rounded"
                  />
            <p className="m-12 text-1xl text-red-400 font-bold">TOAST-nft MARKET</p>
              </div>


             {/**middle div */}


               <div className="flex items-center 
               md:border-2 rounded-full py-2
               md: shadow-sm
               ">
                   <input className="flex-grow pl-5  outline-none text-sm text-gray-700 placeholder-gray-400" 
                   type="text" 
                   placeholder="Search" />
                   <SearchIcon className="hidden md:inline-flex h-8 bg-red-400
                    text-white rounded-full p-2 cursor-pointer md:mx-5 "/>
               </div>

             
             {/** right div */}
              <div className=" flex items-center mx-3 px-7 py-5"> 
               <HomeIcon className="h-6 cursor-pointer"/>
                <Link href ="/">
                  <a className="mr-4 text-pink-700">
                     Home
                  </a>
                </Link>


                <PlusCircleIcon className="hidden md:inline-flex h-6 cursor-pointer"/>
                <Link href ="/create-item">
                  

                  <a className="hidden md:inline-flex mr-4 text-pink-700">
                     Create NFT
                  </a>
                </Link>
                <BriefcaseIcon className="hidden md:inline-flex h-6 cursor-pointer"/>
                <Link href ="/my-assets">

                  <a className="hidden md:inline-flex mr-4 text-pink-700">
                     NFT Dashboard
                  </a>
                </Link>
              </div>
       
        </nav>
    )
}

export default Header
