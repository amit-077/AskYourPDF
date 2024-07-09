"use client";

import { useUser } from "@/app/context/context";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import React from "react";

const page = () => {
  const { user, setUser } = useUser();
  console.log(user);

  const putData = async () => {
    try {
      const data = await axios.post("/api/users/pdf", { user });
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  return <Button onClick={putData}>Change data</Button>;
};

export default page;
