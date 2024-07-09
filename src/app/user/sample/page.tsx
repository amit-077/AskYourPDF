"use client";

import { useUser } from "@/app/context/context";
import getUser from "@/app/server/getUser";
import { auth } from "@/auth";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  //   const [user, setUser] = useState<Session | null>();
  const { user, setUser } = useUser();

  const fetchUser = async () => {
    let data = await getUser();
    if (!data) {
      redirect("/user/signup");
    }
    console.log(data);
    setUser(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Box>
      <Text>{user?.user.name}</Text>
    </Box>
  );
};

export default page;
