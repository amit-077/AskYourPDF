import { Avatar, Box, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import { RiRobot2Line } from "react-icons/ri";
import BeatLoader from "react-spinners/BeatLoader";

const BotMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Box
      display={"flex"}
      alignItems={"flex-start"}
      gap={"0.2rem"}
      pl={"1.5rem"}
      pr={"1.5rem"}
      pt={"1.3rem"}
      pb={"1.3rem"}
    >
      <Box>
        <Avatar
          size={"xs"}
          bgColor={"#333"}
          borderRadius={"0.2rem"}
          icon={<RiRobot2Line size={"1rem"} />}
        />
      </Box>
      <Box
        h={"100%"}
        display={"flex"}
        alignItems={"center"}
        w={"100%"}
        pl={"1rem"}
      >
        <Text h={"100%"} textAlign={"justify"} fontFamily={"Rubik"}>
          {message === "!@#$%" ? <BeatLoader size={'6'} color="#aaa"/> : message}
        </Text>
      </Box>
    </Box>
  );
};

export default BotMessage;
