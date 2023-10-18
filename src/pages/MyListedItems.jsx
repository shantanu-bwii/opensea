import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

// A helper function to render sold items
function renderSoldItems(items) {
  return (
    <>
      <h2 className='text-5xl font-semibold px-16 py-2 pt-20'>Sold</h2>
      <div className='grid grid-cols-4 gap-6 px-12 justify-center py-4'>
        {items.map((item) => (
          <div className="w-full max-w-sm border rounded-lg shadow bg-gray-800 border-gray-700" key={item.itemId}>
            <img className="p-8 rounded-t-lg" src={item.image} alt="product image" />
            <div className="px-5 pb-5">
              <h5 className="text-xl text-white font-semibold tracking-tight ">{item.name}</h5>
              <p className='text-gray-400 pb-2'>{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white ">
                  For {Web3.utils.fromWei(item.totalPrice, 'ether')} ETH - Received {Web3.utils.fromWei(item.price, 'ether')} ETH
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const MyListedItems = ({ marketplace, nft, account }) => {
  const [loading, setLoading] = useState(true);
  const [listedItems, setListedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  const loadListedItems = async () => {
    try {
      const itemCount = await marketplace.methods.itemCount().call();
      const updatedListedItems = [];
      const updatedSoldItems = [];

      for (let index = 1; index <= itemCount; index++) {
        const itemInfo = await marketplace.methods.items(index).call();

        if (itemInfo.seller.toLowerCase() === account) {
          const uri = await nft.methods.tokenURI(itemInfo.tokenID).call();

          const response = await fetch(uri);
          const metadata = await response.json();

          const totalPrice = await marketplace.methods.getTotalPrice(itemInfo.itemID).call();

          const item = {
            totalPrice,
            price: itemInfo.price,
            itemId: itemInfo.itemId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image
          };

          updatedListedItems.push(item);

          if (itemInfo.sold) updatedSoldItems.push(item);
        }
      }

      setListedItems(updatedListedItems);
      setSoldItems(updatedSoldItems);
      setLoading(false);
    } catch (error) {
      console.error('Error loading listed items:', error);
    }
  };

  useEffect(() => {
    loadListedItems();
  }, [account]);

    return (
        <>
            {account ? (
                <>
                    {loading ? (
                        <h1 className='text-4xl mx-auto w-full text-center mt-20 pb-4'>Loading...</h1>
                    ) : (
                        <>
                            {listedItems.length > 0 ? (
                                <div>
                                    <h2 className='text-5xl font-semibold px-16 py-6'>Listed</h2>
                                    <div className='grid grid-cols-4 gap-6 px-12 justify-center'>
                                        {listedItems.map((item) => (
                                            <div className="w-full max-w-sm border rounded-lg shadow bg-gray-800 border-gray-700">
                                                <img className="p-8 rounded-t-lg" src={item.image} alt="product image" />
                                                <div className="px-5 pb-5">
                                                    <h5 className="text-3xl text-white font-semibold tracking-tight ">{item.name}</h5>
                                                    <p className='text-gray-400 pb-2'>{item.description}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-2xl text-white font-bold ">{Web3.utils.fromWei(item.totalPrice, 'ether')} ETH</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {soldItems.length > 0 && renderSoldItems(soldItems)}
                                </div>
                            ) : (
                                <>
                                    <h1 className='text-4xl mx-auto w-full text-center mt-20 pb-4'>No Assets available</h1>
                                </>
                            )}
                        </>
                    )}
                </>
            ) : (
                <h1 className='text-4xl mx-auto w-full text-center mt-20 pb-4'>Wallet is not connected...</h1>
            )}
        </>
    );
};

export default MyListedItems;
