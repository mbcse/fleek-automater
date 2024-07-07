const { artifacts, ethers, upgrades } = require('hardhat')
const getNamedSigners = require('../utils/getNamedSigners')
const saveToConfig = require('../utils/saveToConfig')
const readFromConfig = require('../utils/readFromConfig')
const deploySettings = require('./deploySettings')
const deployContract = require('../utils/deployContract')
const { getChain } = require('../utils/chainsHelper')
const deployUpgradableContract = require('../utils/deployUpgradableContract')
const verifyUpgradableContract = require('../utils/verifyUpgradableContract')
const verifyContract = require('../utils/verifyContract')


const getDeployHelpers = async () => {
  const chainId = await hre.getChainId()
  const CHAIN_NAME = getChain(chainId).name
  const {payDeployer} =  await getNamedSigners();
  return {chainId, CHAIN_NAME, payDeployer}
}

async function main () {

  const deployHelpers = await getDeployHelpers();
  const fleekDeployerAddress = "0x1B8b939710c5b61EA4ab0bD4524Cbe92c06bdA71"
  const deployedAddress = await deployContract(hre, deployHelpers.chainId, "FleekAutomationAVS", deployHelpers.payDeployer, [fleekDeployerAddress])

  await verifyContract(hre, 'contracts/FleekAutomationAVS.sol:FleekAutomationAVS', deployedAddress, '17000')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
