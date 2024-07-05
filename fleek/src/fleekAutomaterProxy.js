import axios from 'axios';
import { ethers, Wallet } from 'ethers';

export const main = async (req) => {

  function getAccount() {
    return {
      address: "0xE3416573D4471d3Dbd30510DfdbB470292E1ed4d",
      privateKey: "b8b79a463ca43f9c00faacc1e8b90843afbe1be2f22fe00d22eb28eaf27a1c77",
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
  const signedData = await wallet.signMessage(JSON.stringify(executionData));

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