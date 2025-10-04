import * as admin from 'firebase-admin';

// Firebase Admin SDK 초기화
export const initializeFirebase = () => {
  if (!admin.apps.length) {
    // Firebase 환경 변수가 설정되지 않은 경우 초기화를 건너뜀
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      console.warn('Firebase credentials not found. Push notifications will be disabled.');
      return null;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return admin;
};
