import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Direct Firebase configuration (from user's provided config)
const firebaseConfig = {
  apiKey: "AIzaSyAy-t9iIZ6DESl-HlS-S3EWE_h88IfL4a8",
  authDomain: "charlieverse-60504.firebaseapp.com",
  projectId: "charlieverse-60504",
  storageBucket: "charlieverse-60504.firebasestorage.app",
  messagingSenderId: "101161384884",
  appId: "1:101161384884:web:769bab026e6179e75c10e1",
  measurementId: "G-LBGTLWK1L0"
};

// Initialize Firebase
let app;
let auth;
let isFirebaseEnabled = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  isFirebaseEnabled = true;
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization failed:', error);
  isFirebaseEnabled = false;
  auth = null;
}

export { auth, isFirebaseEnabled };
