import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db/connect";
import mongoose from "mongoose";
import User from "./models/User";
import { IUser } from "./app/assets/interfaces";
// import { getUserByEmail } from "./app/users";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      verified: boolean;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    verified: boolean;
  }
}

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      async authorize(credentials) {
        if (credentials === null) return null;
        console.log(credentials);
        connectDB();
        try {
          const user = await User.findOne({ email: credentials?.email });
          if (credentials?.type === "signup") {
            if (!user) {
              const newUser = User.create({
                name: credentials?.name,
                email: credentials?.email,
                password: credentials?.password,
              });
              return newUser;
            } else {
              throw new Error("User already exists");
            }
          } else if (credentials?.type === "login") {
            if (user && user.password === credentials?.password) {
              return user;
            } else {
              throw new Error("Invalid Credentials");
            }
          }
        } catch (e) {
          console.log(e);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as IUser;
        token.id = customUser._id;
        token.name = customUser.name;
        token.verified = customUser.verified;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;

      return session;
    },
  },
});
