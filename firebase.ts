// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCzXj9f_LGcL5OSFZyqNYRLXtL9O_5DQz8",
  authDomain: "backendapiauth.firebaseapp.com",
  projectId: "backendapiauth",
  storageBucket: "backendapiauth.appspot.com",
  messagingSenderId: "851401357887",
  appId: "1:851401357887:web:1d9cebc4d86a0bc99d168a"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Set up authentication persistence
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log('Authentication state persistence enabled');
  })
  .catch((error) => {
    console.error('Error setting up authentication persistence:', error);
  });

export { auth };
