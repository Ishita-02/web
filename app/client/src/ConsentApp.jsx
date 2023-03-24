import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ConsentContract from './contracts/ConsentContract.json';

const web3 = new Web3(Web3.givenProvider);

function ConsentApp() {
  const [userAddress, setUserAddress] = useState('');
  const [thirdPartyAddress, setThirdPartyAddress] = useState('');
  const [consentStatus, setConsentStatus] = useState(false);

  useEffect(() => {
    async function loadBlockchainData() {
      const accounts = await web3.eth.getAccounts();
      setUserAddress(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const networkData = ConsentContract.networks[networkId];

      if (networkData) {
        const contract = new web3.eth.Contract(ConsentContract.abi, networkData.address);
        const status = await contract.methods.verifyConsent(accounts[0], thirdPartyAddress).call();
        setConsentStatus(status);
      }
    }

    loadBlockchainData();
  }, [thirdPartyAddress]);

  async function handleGiveConsent() {
    const networkId = await web3.eth.net.getId();
    const networkData = ConsentContract.networks[networkId];

    if (networkData) {
      const contract = new web3.eth.Contract(ConsentContract.abi, networkData.address);
      await contract.methods.giveConsent(thirdPartyAddress).send({ from: userAddress });
      setConsentStatus(true);
    }
  }

  async function handleRevokeConsent() {
    const networkId = await web3.eth.net.getId();
    const networkData = ConsentContract.networks[networkId];

    if (networkData) {
      const contract = new web3.eth.Contract(ConsentContract.abi, networkData.address);
      await contract.methods.revokeConsent(thirdPartyAddress).send({ from: userAddress });
      setConsentStatus(false);
    }
  }

  return (
    <div>
      <h1>Consent Management</h1>
      <p>User Address: {userAddress}</p>
      <p>Third-Party Address: <input value={thirdPartyAddress} onChange={e => setThirdPartyAddress(e.target.value)} /></p>
      <p>Consent Status: {consentStatus ? 'Given' : 'Not Given'}</p>
      {!consentStatus && <button onClick={handleGiveConsent}>Give Consent</button>}
      {consentStatus && <button onClick={handleRevokeConsent}>Revoke Consent</button>}
    </div>
  );
}

export default ConsentApp;
