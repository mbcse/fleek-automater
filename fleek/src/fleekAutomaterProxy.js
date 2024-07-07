import axios from 'axios';
import { ethers, Wallet } from 'ethers';

export const main = async (req) => {

  function getAccount() {
    return {
      address: "0x1B8b939710c5b61EA4ab0bD4524Cbe92c06bdA71",
      privateKey: "1c4179968de4655ebe40e9cf90c2b94c5cb8b14dd6ada4a8e8f3a85228ab515f",
    };
  }
  
  function dateToUnixTimestamp(date) {
    return Math.floor(date.getTime() / 1000);
  }

  const account = getAccount();
  
  const { fleekUrl } = req.body;
  
  console.log("Hitting url", fleekUrl);
  const callResponse = await axios.get(fleekUrl);

  const unixTimeStamp = dateToUnixTimestamp(new Date());
  const executionData = { fleekUrl, unixTimeStamp };

  const wallet = new Wallet(account.privateKey);

  const messageHash = ethers.utils.solidityKeccak256(['string', 'uint256'], [fleekUrl, unixTimeStamp]);

  // Convert message hash to byte array before signing
  const messageBytes = ethers.utils.arrayify(messageHash);
  
  const signedData = await wallet.signMessage(messageBytes);

  return {
    status: 200,
    body: JSON.stringify({  
      executionData,
      signedData,
      callResponse
     }),
    headers: [],
  };
};