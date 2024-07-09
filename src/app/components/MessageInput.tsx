"use client";

import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MessageArray, MessageInputProps } from "../assets/interfaces";

const MessageInput: React.FC<MessageInputProps> = ({
  viewPDF,
  uploadPDF,
  setMessagesArray,
  setMessage,
  message,
  chatWithPdf,
  resLoading,
}) => {
  return (
    <Box
      pt={"0.7rem"}
      w={"100%"}
      pl={"1rem"}
      pb={"2rem"}
      pr={"1rem"}
      display={"flex"}
      alignItems={"center"}
      gap={"1rem"}
      bgColor={""}
    >
      {/* Input for uploading file */}
      <Input
        type="file"
        id="uploadFile"
        display={"none"}
        accept="application/pdf"
        onChange={(e) => {
          uploadPDF(e);
        }}
      />
      <Box
        cursor={!viewPDF ? "pointer" : "default"}
        _hover={{ bgColor: !viewPDF ? "#f5f5f5" : "transparent" }}
        transition={"0.5s all"}
        p={"0.3rem 0.5rem 0.3rem 0.5rem"}
        borderRadius={"0.5rem"}
        onClick={() => {
          if (viewPDF) {
            return;
          }
          document.getElementById("uploadFile")?.click();
        }}
      >
        <Text fontSize={"1.2rem"}>
          <i className="fa-regular fa-file-pdf"></i>
        </Text>
      </Box>
      <InputGroup>
        <Input
          placeholder="Enter your question (max 1,000 characters)"
          borderRadius={"0.2rem"}
          pt={"0.6rem"}
          pb={"0.6rem"}
          h={"auto"}
          display={"flex"}
          _focusVisible={{ outline: "none" }}
          bgColor={"#fff"}
          maxLength={1000}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          value={message}
        />
        <InputRightElement mr={"0.5rem"} cursor={"pointer"} h={"100%"}>
          <Box
            _hover={{ bgColor: "#f5f5f5" }}
            transition={"0.5s all"}
            p={"0.4rem 0.8rem 0.4rem 0.8rem"}
            borderRadius={"0.5rem"}
            onClick={chatWithPdf}
          >
            <Text>
              <i className="fa-regular fa-paper-plane"></i>
            </Text>
          </Box>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default MessageInput;
