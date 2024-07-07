// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract FleekAutomationAVS {
    using MessageHashUtils for bytes32;
    using ECDSA for bytes32;
    struct Schedule {
        uint256 startTimestamp;
        uint256 endTimestamp;
        uint256 time_interval;
        address operator;
        uint256 last_hit;
    }

    mapping(string => Schedule) public UrlToSchedule;

    address public AVS_PUBLIC_ADDRESS;

    event FleekAutomationCreated(
        string fleek_url,
        uint256 startTimestamp,
        uint32 endTimestamp,
        uint256 interval,
        address operator,
        uint256 last_hit
    );


    constructor(address avs_public_address) {
        AVS_PUBLIC_ADDRESS = avs_public_address;
    }

    function fleek_automation_init(
        string memory fleek_url,
        uint256 startTimestamp,
        uint32 endTimestamp,
        uint256 interval,
        address operator
    ) public {

        // require(UrlToSchedule[fleek_url].startTimestamp == 0, "Already exists");
        require(startTimestamp < endTimestamp, "Invalid time interval");

        UrlToSchedule[fleek_url] = Schedule({
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
            time_interval: interval,
            operator: operator,
            last_hit: startTimestamp
        });

        emit FleekAutomationCreated(fleek_url, startTimestamp, endTimestamp, interval, operator, startTimestamp);
    }

    function verifySignature(
        string memory url,
        uint256 timestamp,
        bytes memory signature
    ) public view returns (address) {
        bytes32 messageHash = keccak256(abi.encodePacked(url, timestamp));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        // Recovering signer address from signature
        address signer = ECDSA.recover(ethSignedMessageHash, signature);
        
        return signer;
    }

    function ping(
        bytes memory signature,
        string memory url,
        uint64 timestamp
    ) public {
        Schedule memory scheduleData = UrlToSchedule[url];

        bytes32 messagehash = keccak256(abi.encodePacked(url, timestamp));
        bytes32 ethSignedMessageHash = messagehash.toEthSignedMessageHash();

        address signer = verifySignature(url, timestamp, signature);

        require(signer == AVS_PUBLIC_ADDRESS, "Not operator");

        require(
            scheduleData.startTimestamp <= timestamp &&
            scheduleData.endTimestamp >= timestamp,
            "Invalid timestamp"
        );

        uint256 correctHitTime = scheduleData.last_hit + scheduleData.time_interval;

        require(
             timestamp > correctHitTime - 30 ||  timestamp < correctHitTime + 30,
            "Invalid hit"
        );

        scheduleData.last_hit = block.timestamp;
    }
}
