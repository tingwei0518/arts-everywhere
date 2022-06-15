// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'personalproject-ad825.firebaseapp.com',
  projectId: 'personalproject-ad825',
  storageBucket: 'personalproject-ad825.appspot.com',
  messagingSenderId: '1085704017674',
  appId: '1:1085704017674:web:e3db6422254586bbd2ccf3',
  measurementId: 'G-KSE5EVQFR0',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app; //
// const analytics = getAnalytics(app);
