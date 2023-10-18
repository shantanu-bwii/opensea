import React, { useState } from "react";
import axios from "axios";
import Web3 from "web3";

const Create = ({ marketplace, nft, account, provider }) => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize a Web3 instance with an Infura endpoint
  const web3 = new Web3("https://goerli.infura.io/v3/0791bca5228a4371bbbafca395349de1");

  // Handle changes to the image input field
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!image || !name || !description || !price) {
        alert('Please fill in all fields');
        return;
      }

      // Create a FormData object to send the NFT data to Pinata
      const formData = new FormData();
      formData.append("title", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("file", image);

      // Send the file to Pinata for IPFS pinning
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `YOUR_PINATA_API_KEY`,
          pinata_secret_api_key: `YOUR_PINATA_SECRET_API_KEY`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(resFile.data);
      mintThenList(resFile.data);
    } catch (error) {
      console.log("Error sending File to IPFS: ");
      console.log(error);
      setLoading(false);
    }
  };

  // Mint NFT and list it in the marketplace
  const mintThenList = async (token) => {
    const uri = `https://gateway.pinata.cloud/ipfs/${token.IpfsHash}`;
    try {
      // Mint NFT
      const mintTx = await nft.methods.mint(uri).send({
        from: account,
        gas: 2000000,
        gasPrice: '5000000000',
      });

      const tokenId = mintTx.events.Transfer.returnValues.tokenId;

      // Approve marketplace to spend NFT
      await nft.methods.setApprovalForAll(marketplace._address, true).send({
        from: account,
        gas: 2000000,
        gasPrice: '5000000000',
      });

      // Add NFT to the marketplace
      const listingPrice = web3.utils.toWei(price, "ether");
      await marketplace.methods.makeItem(nft._address, tokenId, listingPrice).send({
        from: account,
        gas: 2000000,
        gasPrice: '5000000000',
      });

      alert("NFT Created Successfully");
    } catch (error) {
      alert("Error minting and listing NFT");
      console.error("Error minting and listing NFT:", error);
    }
    setLoading(false);
  };

  return (
    <div className="mt-20 bg-white rounded-lg shadow sm:max-w-md sm:w-full sm:mx-auto sm:overflow-hidden">
      <div className="px-4 py-8 sm:px-10">
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm leading-5">
            <span className="px-2 text-gray-500 bg-white">Create NFT</span>
          </div>
        </div>
        <div className="mt-6">
          <div className="w-full space-y-6">
            <div className="w-full">
              <div className="relative ">
                <input
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                  id="search-form-price"
                  className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="NFT price"
                  value={price}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="relative ">
                <input
                  type="text"
                  id="search-form-location"
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="NFT title"
                  value={name}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="relative ">
                <input
                  type="textarea"
                  id="search-form-name"
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="NFT description"
                  value={description}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="relative ">
                <input
                  type="file"
                  accept="image/*"
                  id="search-form-name"
                  onChange={handleImageChange}
                  className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-transparent border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="NFT Image"
                />
              </div>
            </div>
            <div>
              <span className="block w-full rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 "
                >
                  {loading ? 'Loading...' : 'Create NFT'}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
