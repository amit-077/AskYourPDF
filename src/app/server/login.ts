"use server";

import { signIn } from "@/auth";

export const credentialLogin = async ({
  name,
  email,
  password,
  type,
}: {
  name: string;
  email: string;
  password: string;
  type: string;
}) => {
  try {
    const response = await signIn("credentials", {
      name,
      email,
      password,
      type,
      redirect: false,
    });
    return {
      response,
      message: type === "signup" ? "User signedIn" : "User logged in",
    };
  } catch (error: any) {
    return type === "signup" ? "User already Exists" : "Invalid Credentials";
  }
};
