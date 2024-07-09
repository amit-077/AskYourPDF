"use client";

import { credentialLogin } from "@/app/server/login";
import { Box, Button, Input } from "@chakra-ui/react";
import React, { useState } from "react";

const page = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    type: "login",
  });
  return (
    <Box>
      <Input
        placeholder="name"
        name="name"
        onChange={(e) => {
          setUserDetails((prevVal) => {
            return { ...prevVal, [e.target.name]: e.target.value };
          });
        }}
      />
      <Input
        placeholder="email"
        name="email"
        onChange={(e) => {
          setUserDetails((prevVal) => {
            return { ...prevVal, [e.target.name]: e.target.value };
          });
        }}
      />
      <Input
        placeholder="password"
        name="password"
        onChange={(e) => {
          setUserDetails((prevVal) => {
            return { ...prevVal, [e.target.name]: e.target.value };
          });
        }}
      />
      <Button
        onClick={async () => {
          let data = await credentialLogin({
            name: userDetails.name,
            email: userDetails.email,
            password: userDetails.password,
            type: userDetails.type,
          });
          console.log(data);
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default page;
