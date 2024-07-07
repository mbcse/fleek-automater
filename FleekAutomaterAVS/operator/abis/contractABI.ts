export const contractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "avs_public_address",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "ECDSAInvalidSignature",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "length",
                "type": "uint256"
            }
        ],
        "name": "ECDSAInvalidSignatureLength",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "s",
                "type": "bytes32"
            }
        ],
        "name": "ECDSAInvalidSignatureS",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "fleek_url",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "startTimestamp",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint32",
                "name": "endTimestamp",
                "type": "uint32"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "interval",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "last_hit",
                "type": "uint256"
            }
        ],
        "name": "FleekAutomationCreated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "AVS_PUBLIC_ADDRESS",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "UrlToSchedule",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "startTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "time_interval",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "last_hit",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "fleek_url",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "startTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint32",
                "name": "endTimestamp",
                "type": "uint32"
            },
            {
                "internalType": "uint256",
                "name": "interval",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "fleek_automation_init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
            },
            {
                "internalType": "string",
                "name": "url",
                "type": "string"
            },
            {
                "internalType": "uint64",
                "name": "timestamp",
                "type": "uint64"
            }
        ],
        "name": "ping",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];