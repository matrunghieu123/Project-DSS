import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBRcBFOaTthnmAQ6yxZax2046LlPkY-XC8",
  authDomain: "pj-dss.firebaseapp.com",
  projectId: "pj-dss",
  storageBucket: "pj-dss.appspot.com",
  messagingSenderId: "970324525964",
  appId: "1:970324525964:web:523ac264a097c4da6dcca9",
  measurementId: "G-BW0TVRE6Q5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export initialized services
export { auth, db, storage, analytics };

// Initialize Firebase services
export const imageDb = getStorage(app)

// Export default app
export default app;
