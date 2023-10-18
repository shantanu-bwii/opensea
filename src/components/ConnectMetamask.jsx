import React, { useState } from 'react';

const MetaMaskConnect = () => {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const connectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
      } else {
        alert('MetaMask extension not detected. Please install it.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      
    </div>
  );
};

export default MetaMaskConnect;
