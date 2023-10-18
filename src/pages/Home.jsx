import { useEffect, useState } from 'react';
import web3 from 'web3'; // This should be imported as "Web3" with an uppercase 'W'.

const Home = ({ marketplace, nft, account }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to load items from the marketplace
  const loadMarketplace = async () => {
    if (marketplace) {
      const itemCount = await marketplace.methods.itemCount().call();
      const updatedItems = [];

      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplace.methods.items(i).call();

        if (!item.sold) {
          const uri = await nft.methods.tokenURI(item.tokenID.toNumber()).call();
          const response = await fetch(uri);
          const metadata = await response.json();
          const totalPrice = await marketplace.methods.getTotalPrice(item.itemID.toNumber()).call();

          updatedItems.push({
            totalPrice,
            itemId: item.itemID,
            seller: item.seller,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
          });
        }
      }

      setItems(updatedItems);
      setLoading(false);
    }
  };

  // Function to buy an item from the marketplace
  const buyItem = async (item) => {
    try {
      await marketplace.methods.purchaseItem(item.itemId).send({
        from: account,
        value: item.totalPrice,
      });

      setLoading(true);
      loadMarketplace();
    } catch (error) {
      console.error('Error buying item:', error);
    }
  };

  // Load items from the marketplace when the component mounts or when dependencies change
  useEffect(() => {
    loadMarketplace();
  }, [marketplace, nft, items]);

    return <>
        {account ? (
            <>
                {loading ? (
                    <h1 className=' text-4xl mx-auto w-full text-center mt-20 pb-4'>Loading...</h1>
                ):(
                    <>
                        {items.length > 0 ? (
                            <div className='grid grid-cols-4 gap-6 px-12 justify-center py-20'>
                                {items.map((item) => (
                                    <div className="w-full max-w-sm border rounded-lg shadow bg-gray-800 border-gray-700">
                                        <img className="p-8 rounded-t-lg" src={item.image} alt="product image" />
                                        <div className="px-5 pb-5">
                                            <h5 className="text-3xl text-white font-semibold tracking-tight ">{item.name}</h5>
                                            <p className='text-gray-400 pb-2'>{ item.description }</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl text-white font-bold ">{web3.utils.fromWei(item.totalPrice, 'ether')} ETH</span>
                                                <button
                                                    onClick={() => buyItem(item)}
                                                    className=" focus:ring-4 text-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                                                >
                                                    Buy Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ):(
                            <>
                            <h1 className=' text-4xl mx-auto w-full text-center mt-20 pb-4'>No Assets available</h1>
                            </>
                        )}
                    </>
                )}
            </>
        ):(
            <h1 className=' text-4xl mx-auto w-full text-center mt-20 pb-4'>Connect your wallet to explore NFTs</h1>
        )}
    </>
}

export default Home;