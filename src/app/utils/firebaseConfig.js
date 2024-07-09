import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "docchat-ba6c2",
  storageBucket: "docchat-ba6c2.appspot.com",
  messagingSenderId: "174389331764",
  appId: "",
  measurementId: "G-2NPPGTHYM6",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
