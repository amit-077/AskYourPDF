"use client";
// context/UserContext.tsx
import { Session } from "next-auth";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import getUser from "../server/getUser";

interface UserContextType {
  user: Session | null;
  setUser: (user: Session | null) => void; // Adjusted setUser type
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Session | null>(null);

  useEffect(() => {
    const setUserNow = async () => {
      try {
        const userData = await getUser();
        setUser(userData); // Assuming getUser returns Session | null directly
      } catch (error) {
        console.error("Error setting user:", error);
      }
    };

    setUserNow();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
