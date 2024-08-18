// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqbfj2CvL3ToJI_bpLfmiSI7_kRQZb-HA",
  authDomain: "flashcard-maker-8c68a.firebaseapp.com",
  projectId: "flashcard-maker-8c68a",
  storageBucket: "flashcard-maker-8c68a.appspot.com",
  messagingSenderId: "594616203680",
  appId: "1:594616203680:web:93ab71da3416864c31ccc5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
export default database;