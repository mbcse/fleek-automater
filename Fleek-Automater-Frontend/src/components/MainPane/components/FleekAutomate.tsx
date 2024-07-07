import { type FC, type ChangeEvent, type MouseEvent, useEffect, useState, useCallback } from "react";

import { Box, Button, Flex, Input, Select, Text, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { baseSepolia } from "viem/chains";
import { useAccount, useChainId, useReadContract, useWriteContract } from "wagmi";

import { FLEEK_AUTOMATION_AVS_ABI, FLEEK_AUTOMATION_AVS_ADDRESS } from "@/config";
import { useNotify } from "@/hooks";
import { getDefaultEthersSigner, getEthersSignes } from "@/utils/clientToEtherjsSigner";
import { convertToUnixTimestamp } from "@/utils/timeUtils";

import LoadingScreen from "./LoadingScreen";

const FleekAutomate: FC = () => {
  const account = useAccount();
  const chainId = useChainId();

  const [fleekUrl, setFleekUrl] = useState("");
  const [cronSchedule, setCronSchedule] = useState("");
  const [endDate, setEndDate] = useState("");
  const [schedules, setSchedules] = useState<any[]>([]); // State to store schedules

  const [isLoading, setIsLoading] = useState(false);
  const { notifyError, notifySuccess } = useNotify();

  const createFleekSchedule = async () => {
    setIsLoading(true);
    try {
      const signer = await getDefaultEthersSigner();
      const contract = new ethers.Contract(
        FLEEK_AUTOMATION_AVS_ADDRESS[17000],
        FLEEK_AUTOMATION_AVS_ABI,
        signer
      );

      const tx = await contract.fleek_automation_init(
        fleekUrl,
        convertToUnixTimestamp(new Date()),
        convertToUnixTimestamp(new Date(endDate)),
        cronSchedule,
        account.address
      );

      await tx.wait();
      notifySuccess({
        title: "Automation Schedule Created",
        message: "Automation Schedule Created Txhash :" + tx.hash,
      });

      // Update the schedules state
      setSchedules((prevSchedules) => [
        ...prevSchedules,
        { fleekUrl, cronSchedule, endDate, txHash: tx.hash },
      ]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, [notifyError, notifySuccess]);

  return (
    <Flex
      w={"100%"}
      display={"flex"}
      justifyContent={"space-around"}
      flexWrap={"wrap"}
      gap={5}
    >
      <LoadingScreen isLoading={isLoading} />

      <VStack w={"60%"} minWidth={"270px"} gap={2}>
        <Text textAlign="left" fontWeight="bold">
          Enter Fleek URL
        </Text>
        <Input
          value={fleekUrl}
          onChange={(e) => setFleekUrl(e.target.value)}
          type="textarea"
          placeholder="Enter Fleek Edge Function URL"
        />
      </VStack>

      <VStack w={"60%"} minWidth={"270px"} gap={2} textAlign="left">
        <Text textAlign="left" fontWeight="bold">
          Execution schedule
        </Text>
        <Input
          value={cronSchedule}
          onChange={(e) => setCronSchedule(e.target.value)}
          type="textarea"
          placeholder="Please enter Execution schedule In every _ seconds"
        />
      </VStack>

      <VStack w={"60%"} minWidth={"270px"} gap={2} textAlign="left">
        <Text textAlign="left" fontWeight="bold">
          Cron Expiry
        </Text>
        <Input
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
          type="datetime-local"
        />
      </VStack>

      <VStack w={"45%"} minWidth={"270px"} gap={2} textAlign="left">
        <Button
          colorScheme="teal"
          variant="solid"
          onClick={() => {
            createFleekSchedule();
          }}
          isLoading={isLoading}
          className="custom-button"
        >
          Create Schedule
        </Button>
      </VStack>

      <VStack w={"100%"} minWidth={"270px"} gap={2} textAlign="left">
        <Text textAlign="left" fontWeight="bold">
          Created Schedules
        </Text>
        {schedules.map((schedule, index) => (
          <Box key={index} p={4} borderWidth="1px" borderRadius="lg" w="100%">
            <Text>Fleek URL: {schedule.fleekUrl}</Text>
            <Text>Execution Schedule: {schedule.cronSchedule}</Text>
            <Text>End Date: {schedule.endDate}</Text>
            <Text>Transaction Hash: {schedule.txHash}</Text>
          </Box>
        ))}
      </VStack>
    </Flex>
  );
};

export default FleekAutomate;
