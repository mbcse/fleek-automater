import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { delegationABI } from "./abis/delegationABI";
import { contractABI } from './abis/contractABI';
import { registryABI } from './abis/registryABI';
import { avsDirectoryABI } from './abis/avsDirectoryABI';
import axios from 'axios';
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const delegationManagerAddress = process.env.DELEGATION_MANAGER_ADDRESS!;
const contractAddress = process.env.CONTRACT_ADDRESS!;
const stakeRegistryAddress = process.env.STAKE_REGISTRY_ADDRESS!;
const avsDirectoryAddress = process.env.AVS_DIRECTORY_ADDRESS!;

const delegationManager = new ethers.Contract(delegationManagerAddress, delegationABI, wallet);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);
const registryContract = new ethers.Contract(stakeRegistryAddress, registryABI, wallet);
const avsDirectory = new ethers.Contract(avsDirectoryAddress, avsDirectoryABI, wallet);

const fleekAutomationFunctionUrl = "https://billions-manchester-screeching.functions.on-fleek.app"

let automationTasks: any = []

setInterval(async () => {
    console.log(automationTasks)
    for (let i = 0; i < automationTasks.length; i++) {
       try {
         const task = automationTasks[i];
         const currentTimestamp = Math.floor(Date.now() / 1000);
 
         if (currentTimestamp >= Number(task.startTimestamp) && currentTimestamp <= Number(task.endTimestamp)) {
            console.log(
                `Executing Schedule for ${task.fleek_url}`
            )

            console.log("current timestamp: " + Number(currentTimestamp))
            console.log("Hit Time", Number(task.last_hit) + Number(task.interval))
            if(currentTimestamp >= (Number(task.last_hit) + Number(task.interval)) ){
                console.log("Time to Hit")
                const responseData = await hitFleekFunction(task.fleek_url)
                await signAndRespondToTask(responseData.executionData.fleekUrl, responseData.executionData.unixTimeStamp, responseData.signedData)
                automationTasks[i].last_hit = currentTimestamp
            }
         }

         if(currentTimestamp >= Number(task.endTimestamp)){
            if(automationTasks.length >1) {
                let temp = automationTasks[automationTasks.length -1 ]
                automationTasks[automationTasks.length -1 ] = task
                automationTasks[i] = temp
                automationTasks.pop()
                i--;
            }
            else {
                automationTasks.pop()
            }
         }
       } catch (error) {
           console.log("Could not Execute, Passing and Trying Again")
       }
    }
}, 5000);


const fetchUrl = async (fleek_url: any) => {

    try {
            console.log("Hitting Fleek Automation Proxy", fleek_url)
            let data = JSON.stringify({
                "fleekUrl": fleek_url
            });
        
            let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://billions-manchester-screeching.functions.on-fleek.app',
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
            };
        
            const resp =  await axios.request(config)
        
            return resp.data
    } catch (error) {
        console.log(error)
    }
}


const hitFleekFunction = async (fleek_url: any) => {
    const response = await fetchUrl(fleek_url);
    return response;
}

const signAndRespondToTask = async (fleek_url: any, timestamp: any, fleekSignature: any) => {


    console.log("Submit proof of Execution to AVS")

    const tx = await contract.ping(
        fleekSignature,
        fleek_url,
        timestamp
    );

    await tx.wait();
    console.log(`Scheduled Task for ${fleek_url} executed successfully`);
};

const registerOperator = async () => {
try {
        const tx1 = await delegationManager.registerAsOperator({
            earningsReceiver: wallet.address,
            delegationApprover: "0x0000000000000000000000000000000000000000",
            stakerOptOutWindowBlocks: 0
        }, "");
        await tx1.wait();
        console.log("Operator registered on EL successfully");
    
        const salt = ethers.utils.hexlify(ethers.utils.randomBytes(32));
        const expiry = Math.floor(Date.now() / 1000) + 3600; // Example expiry, 1 hour from now
    
        // Define the output structure
        let operatorSignature = {
            expiry: expiry,
            salt: salt,
            signature: ""
        };
    
        // Calculate the digest hash using the avsDirectory's method
        const digestHash = await avsDirectory.calculateOperatorAVSRegistrationDigestHash(
            wallet.address, 
            contract.address, 
            salt, 
            expiry
        );
    
        // Sign the digest hash with the operator's private key
        const signingKey = new ethers.utils.SigningKey(process.env.PRIVATE_KEY!);
        const signature = signingKey.signDigest(digestHash);
        
        // Encode the signature in the required format
        operatorSignature.signature = ethers.utils.joinSignature(signature);
    
        const tx2 = await registryContract.registerOperatorWithSignature(
            wallet.address,
            operatorSignature
        );
        await tx2.wait();
        console.log("Operator registered on AVS successfully");
} catch (error) {
    console.log(error)
}
};

const monitorNewTasks = async () => {

    contract.on("FleekAutomationCreated", async (
        fleek_url,
        startTimestamp,
        endTimestamp,
        interval,
        operator,
        last_hit) => {
        console.log(`New Schedule Detected:  ${fleek_url}`);

        automationTasks.push({
            fleek_url,
            startTimestamp,
            endTimestamp,
            interval,
            operator,
            last_hit
        })
    });

    console.log("Monitoring for new tasks...");
};

const main = async () => {
    await registerOperator();
    monitorNewTasks().catch((error) => {
        console.error("Error monitoring tasks:", error);
    });
};

main().catch((error) => {
    console.error("Error in main function:", error);
});