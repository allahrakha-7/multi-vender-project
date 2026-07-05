import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserPopupRedirectResolver } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlSycI2ntbHqJBpcRuvYlAqRvP3BDicww",
  authDomain: "multi-vendor-ecommerce-store.firebaseapp.com",
  projectId: "multi-vendor-ecommerce-store",
  storageBucket: "multi-vendor-ecommerce-store.firebasestorage.app",
  messagingSenderId: "965923086165",
  appId: "1:965923086165:web:992dcd2562ef2cdc3099dc"
};

// Initialize Firebase App checking if it already exists
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth checking if already initialized to avoid crash on Hot Module Replacement (HMR)
let firebaseAuth;
try {
  firebaseAuth = getAuth(app);
} catch {
  firebaseAuth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    popupRedirectResolver: browserPopupRedirectResolver
  });
}

export const auth = firebaseAuth;