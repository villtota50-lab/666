import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

let firebaseApp;
let auth;
let db;

try {
  // We use a guard because the config might not be available yet if the user hasn't accepted terms
  // @ts-ignore
  const firebaseConfig = await import('../firebase-applet-config.json').then(m => m.default).catch(() => null);
  
  if (firebaseConfig) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    
    // Validate connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }
} catch (e) {
  console.warn("Firebase not yet configured.");
}

export { auth, db };
