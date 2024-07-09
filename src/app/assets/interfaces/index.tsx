import { AxiosResponse } from "axios";

export interface MessageInputProps {
  uploadPDF: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewPDF: string | Uint8Array | null;
  setMessagesArray: React.Dispatch<React.SetStateAction<MessageArray[]>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  chatWithPdf: () => void;
  resLoading: boolean
}

export interface MessageArray {
  message: string;
  role: string;
}

export interface IUser {
  // IUser for Interface-User
  _id: string;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  goldUser: boolean;
  premiumUser: boolean;
  __v: number;
}
