"use server";

import { auth } from "@/auth";

const getUser = async () => {
  let user = await auth();
  return user;
};

export default getUser;
