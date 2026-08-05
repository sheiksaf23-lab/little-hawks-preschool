import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7jxkcuafQnrJ-hM7MAqn_tUrlSQyA6PA",
  authDomain: "school-data-base-691cc.firebaseapp.com",
  projectId: "school-data-base-691cc",
  storageBucket: "school-data-base-691cc.firebasestorage.app",
  messagingSenderId: "642026409305",
  appId: "1:642026409305:web:bb70baed5a5f1c29be5048"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

export interface EnquiryData {
  name: string;
  phone: string;
  child: string;
  program: string;
  message?: string;
}

/**
 * Saves enquiry submission into Firebase Firestore "enquiries" collection,
 * with automatic fallback to localStorage as a safety backup.
 */
export async function submitEnquiry(data: EnquiryData) {
  // Always save a local copy as backup so user data is never lost
  try {
    const existing = JSON.parse(localStorage.getItem("school_enquiries") || "[]");
    existing.push({ ...data, timestamp: new Date().toISOString() });
    localStorage.setItem("school_enquiries", JSON.stringify(existing));
  } catch (e) {
    console.warn("Could not save to localStorage backup:", e);
  }

  // Submit to Firebase Firestore
  try {
    const docRef = await addDoc(collection(db, "enquiries"), {
      name: data.name,
      phone: data.phone,
      child: data.child,
      program: data.program,
      message: data.message || "",
      createdAt: serverTimestamp(),
      submittedAt: new Date().toISOString()
    });
    console.log("Enquiry submitted successfully with Document ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding enquiry to Firebase Firestore: ", error);
    throw error;
  }
}
