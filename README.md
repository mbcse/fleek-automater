# Fleek Automator

## Overview
Fleek Automator is an innovative platform designed to automate Fleek edge functions, allowing them to execute at specified intervals over a set period. This decentralized automation tool leverages a unique architecture to ensure that Fleek functions are called reliably and securely, without the need for centralized management.

## Key Features

1. **Automated Scheduling:**
   - Users can schedule Fleek functions to run at specific times and intervals. For example, a function can be set to run every 10 seconds for the next 10 days.

2. **Decentralized Execution:**
   - The system uses a decentralized network of operators to manage and execute scheduled tasks. This eliminates the reliance on a single centralized server, enhancing reliability and security.

3. **Four-Component Architecture:**
   - **Fleek Automator Portal:** A user-friendly interface where users can submit their Fleek function URLs along with the desired execution schedule.
   - **Automator AVS Contract:** A specialized contract connected to the Eigen layer, responsible for managing the automation tasks and distributing them to operators.
   - **Automation Proxy:** A proxy function deployed on Fleek that verifies the execution of scheduled tasks and generates proof-of-hit timestamps.
   - **Operator Nodes:** Decentralized nodes that receive tasks, store information locally, and execute functions at the scheduled times, submitting proof of execution to the AVS contract.

4. **Proof of Hit Verification:**
   - To ensure that functions are executed at the correct times, the Automation Proxy generates a timestamp and signs it with a private key. Operators must submit this proof of hit to the AVS contract, which verifies the accuracy of the execution.

5. **Penalty for Non-Compliance:**
   - Operators that fail to execute tasks at the scheduled times face penalties, ensuring accountability and reliability within the network.

## Demonstration

- **Setup:**
  - The operator code is initialized to communicate with the AVS and Eigen layer contracts, managing the local task copy.
  - Users access the Fleek Automator Portal to submit a Fleek function URL and define the schedule (e.g., every 10 seconds for the next 4 minutes).

- **Execution:**
  - The submitted schedule is detected and monitored by the operators.
  - The Automation Proxy function is called at the specified intervals, generating and submitting proof of hit to the AVS contract.
  - Transactions are recorded in the smart contract, providing a verifiable trail of executions.

- **Monitoring:**
  - Users can view scheduled tasks, monitor ongoing executions, and check the status of transactions through tools like Holiskai.

## Future Plans

- **Production Build:**
  - The current proof of concept will be refined and expanded into a production-ready version, enhancing functionality, security, and user experience.
  - Plans include making the service cashless and integrating additional features to streamline the automation process.

## Conclusion

Fleek Automator offers a robust solution for automating Fleek functions in a decentralized manner. By leveraging a network of operators and a sophisticated proof-of-hit mechanism, it ensures reliable and verifiable function execution, paving the way for more advanced and scalable automation capabilities in the decentralized ecosystem.
