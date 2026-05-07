import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "AIzaSyAjaE0VIL49mw7w4xsw6VuRypugLh9dROc",
  authDomain:        "fullstack-project-ffc77.firebaseapp.com",
  projectId:         "fullstack-project-ffc77",
  storageBucket:     "fullstack-project-ffc77.firebasestorage.app",
  messagingSenderId: "782855769648",
  appId:             "1:782855769648:web:d840102336cd75dd5327f5",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
