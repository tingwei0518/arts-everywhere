import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'arts-everywhere-108b3.firebaseapp.com',
  projectId: 'arts-everywhere-108b3',
  storageBucket: 'arts-everywhere-108b3.appspot.com',
  messagingSenderId: '548994073184',
  appId: '1:548994073184:web:7051a83d742c662e8c7905',
  measurementId: 'G-JR1JF97MKE',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
