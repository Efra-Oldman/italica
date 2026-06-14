import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAXKvY549dSuURmMjjYR2G87ZesnKT3hUk',
  authDomain: 'crm-italica-bolivia.firebaseapp.com',
  projectId: 'crm-italica-bolivia',
  storageBucket: 'crm-italica-bolivia.firebasestorage.app',
  messagingSenderId: '37675749824',
  appId: '1:37675749824:web:31d017141efbef85023825',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
