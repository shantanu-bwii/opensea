import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web3 from 'web3';

import Header from './components/Header';
import Home from './pages/Home';
import Create from './pages/Create';
import MyListedItems from './pages/MyListedItems';
import MyPurchases from './pages/MyPurchases';

import Marketplace from './artifacts/contracts/Marketplace.json';
import NFT from './artifacts/contracts/NFT.json';

function App() {
  const [account, setAccount] = useState('');
  const [nft, setNft] = useState(null);
  const [marketplace, setMarketplace] = useState(null);
  const [provider, setProvider] = useState(null);

  // Initialize Web3 and load contracts when the component mounts
  useEffect(() => {
    web3Handler();
  }, []);

  const web3Handler = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        // Set web3 provider
        const provider = web3.currentProvider;
        setProvider(provider);

        // Listen for chain changes and accounts changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

        window.ethereum.on('accountsChanged', async function (accounts) {
          setAccount(accounts[0]);
          await web3Handler();
        });

        loadContracts(web3);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('MetaMask is not installed');
    }
  };

  const loadContracts = async (web3) => {
    // Use static contract addresses instead of dynamic ones
    const MarketplaceAddress = '0x00FBF0996Afeef9588849e7Cf7c5548c0dd52217';
    const marketplace = new web3.eth.Contract(Marketplace, MarketplaceAddress);
    setMarketplace(marketplace);

    const NFTAddress = '0x5dF47C5EFbbb2a6B12D08C8ac4777B13e078ACBf';
    const nft = new web3.eth.Contract(NFT, NFTAddress);
    setNft(nft);
  };

  return (
    <div className="App">
      <Router>
        <Header web3Handler={web3Handler} account={account} />
        <Routes>
          <Route path="/" element={<Home marketplace={marketplace} nft={nft} account={account} />} />
          <Route path="/create" element={<Create marketplace={marketplace} nft={nft} account={account} provider={provider} />} />
          <Route path="/my-listed-items" element={<MyListedItems nft={nft} marketplace={marketplace} account={account} />} />
          <Route path="/my-purchases" element={<MyPurchases nft={nft} marketplace={marketplace} account={account} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
