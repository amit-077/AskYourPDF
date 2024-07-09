import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import { FiUser } from "react-icons/fi";

const UserMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Box
      display={"flex"}
      alignItems={"flex-start"}
      gap={"0.2rem"}
      pl={"1.5rem"}
      pr={"1.5rem"}
      bgColor={"#FAF9F6"}
      borderBottom={"1px solid #e9e9e9"}
      borderTop={"1px solid #e9e9e9"}
      pt={"1.3rem"}
      pb={"1.3rem"}
    >
      <Box>
        <Avatar
          bg="#ff612f"
          size={"xs"}
          borderRadius={"0.2rem"}
          icon={<FiUser size={"1rem"} />}
        />
      </Box>
      <Box
        h={"100%"}
        display={"flex"}
        alignItems={"center"}
        w={"100%"}
        pl={"1rem"}
      >
        <Text h={"100%"} textAlign={'justify'}>{message}</Text>
      </Box>
    </Box>
  );
};

export default UserMessage;
