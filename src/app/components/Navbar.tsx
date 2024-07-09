import { Box, Text } from "@chakra-ui/react";
import React from "react";

const Navbar = () => {
  return (
    <Box
      w={"100vw"}
      h={"4rem"}
      bgColor={"#F8F5EE"}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      pl={"3rem"}
      pr={"3rem"}
    >
      <Box>
        <Text fontSize={"1.6rem"} fontFamily={"Aladin"} letterSpacing={"1px"}>
          AskYourPDF
        </Text>
      </Box>
      <Box display={"flex"} alignItems={"center"} gap={"4rem"}>
        <Box>
          <Text>Home</Text>
        </Box>
        <Box>
          <Text>About Us</Text>
        </Box>
        <Box>
          <Text>History</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
