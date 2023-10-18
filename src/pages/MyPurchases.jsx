import { useState, useEffect } from 'react';
import web3 from 'web3';

const MyPurchases = ({ nft, marketplace, account }) => {
    const [loading, setLoading] = useState(true);
    const [purchases, setPurchases] = useState([]);

    // Function to load purchased items from the marketplace
    const loadPurchasedItems = async () => {
        if (marketplace) {
            const filter = {
                filter: {
                    buyer: account, // Replace 'buyer' with the actual event parameter name
                },
                fromBlock: 0, // Adjust this to the starting block you're interested in
                toBlock: 'latest', // Use 'latest' for the most recent blocks
            };

            // Fetch past 'Bought' events from the marketplace contract
            const events = await marketplace.getPastEvents('Bought', filter);

            // Process each event and fetch additional item information
            const purchases = await Promise.all(events.map(async (event) => {
                const eventData = event.returnValues; // Get the event data
                const uri = await nft.methods.tokenURI(eventData.tokenID).call();
                const response = await fetch(uri);
                const metadata = await response.json();
                const totalPrice = await marketplace.methods.getTotalPrice(eventData.itemID).call();

                // Create a purchased item object
                const purchasedItem = {
                    totalPrice,
                    price: eventData.price,
                    itemID: eventData.itemID,
                    name: metadata.name,
                    description: metadata.description,
                    image: metadata.image,
                };

                return purchasedItem;
            }));

            setLoading(false);
            setPurchases(purchases);
        }
    }

    // Load purchased items when the component mounts or when dependencies change
    useEffect(() => {
        loadPurchasedItems();
    }, [nft, marketplace]);

    return (
        <>
            {account ? (
                <>
                    {loading ? (
                        <h1 className=' text-4xl mx-auto w-full text-center mt-20 pb-4'>Loading...</h1>
                    ) : (
                        <>
                            {purchases.length > 0 ? (
                                <div>
                                    <div className='grid grid-cols-4 gap-6 px-12 justify-center py-16'>
                                        {purchases.map((item) => (
                                            <div className="w-full max-w-sm border rounded-lg shadow bg-gray-800 border-gray-700">
                                                <img className="p-8 rounded-t-lg" src={item.image} alt="product image" />
                                                <div className="px-5 pb-5">
                                                    <div className="flex items-center justify-between">
                                                        <h5 className="text-3xl font-semibold tracking-tight text-white">{item.name}</h5>
                                                        <span className="text-2xl font-bold text-white">
                                                            {web3.utils.fromWei(item.totalPrice, 'ether')} ETH
                                                        </span>
                                                    </div>
                                                    <p className='text-gray-400 pb-2'>{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <h1 className=' text-4xl mx-auto w-full text-center mt-20 pb-4'>No Assets available</h1>
                            )}
                        </>
                    )}
                </>
            ) : (
                <h1 className=' text-4xl mx-auto w-full text-center mt-20 pb-4'>Wallet is not connected...</h1>
            )}
        </>
    );
};

export default MyPurchases;
