import { initializeApp } from 'firebase/app';
import { getPerformance } from "firebase/performance";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyB7kFZdfEAirn9303k2dgv1M4SgKtmAhAc",
  authDomain: "terradirect-80536.firebaseapp.com",
  databaseURL: "https://terradirect-80536-default-rtdb.firebaseio.com",
  projectId: "terradirect-80536",
  storageBucket: "terradirect-80536.firebasestorage.app",
  messagingSenderId: "861139612520",
  appId: "1:861139612520:web:4009fd2ab42b893e681cdd",
  measurementId: "G-2LHM3TSTVQ",
};

const app = initializeApp(firebaseConfig);
const perf = getPerformance(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export default app;
