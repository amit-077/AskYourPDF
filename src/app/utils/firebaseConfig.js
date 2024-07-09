import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBBlwYbSoiJeMyEiRIONPqkgfrMsrSZBjM",
  authDomain: "docchat-ba6c2.firebaseapp.com",
  projectId: "docchat-ba6c2",
  storageBucket: "docchat-ba6c2.appspot.com",
  messagingSenderId: "174389331764",
  appId: "1:174389331764:web:2782fb9e59e78c31350761",
  measurementId: "G-2NPPGTHYM6",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
