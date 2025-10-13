import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// Check if all required Firebase config variables are available
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate Firebase config
const isFirebaseConfigValid = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.projectId && 
         firebaseConfig.appId && 
         firebaseConfig.messagingSenderId
}

let app: any = null
let messaging: any = null

// Initialize Firebase only if config is valid and in production browser
try {
  if (isFirebaseConfigValid()) {
    app = initializeApp(firebaseConfig)
    // Initialize messaging only if supported, in browser, and in production
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      messaging = getMessaging(app)
    }
  } else {
    console.warn('Firebase configuration is incomplete. Firebase features will be disabled.')
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error)
}

export const requestNotificationPermission = async () => {
  try {
    if (!messaging) {
      if (process.env.NODE_ENV !== 'production') {
        // silent in dev
        return null
      }
      console.warn('Firebase messaging not available')
      return null
    }

    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      })
      return token
    } else {
      if (process.env.NODE_ENV !== 'production') {
        // silent in dev
        return null
      }
      console.log('Notification permission denied')
      return null
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // silent in dev
      return null
    }
    console.error('Error requesting notification permission:', error)
    return null
  }
}

export const onMessageListener = () => {
  if (!messaging) {
    return Promise.resolve(() => {})
  }

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })
}
