import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

const firebaseConfig = {
  projectId: "backawi",
  appId: "1:81104195142:web:8a2ae6f8c59125d165c447",
  storageBucket: "backawi.appspot.com",
  apiKey: "AIzaSyDwzmYdDJvKXKrHEiymtQb7_0D5b7FY1so",
  authDomain: "backawi.firebaseapp.com",
  messagingSenderId: "81104195142",
  measurementId: "G-CTN4LKYDCS"
};

export const appConfig: ApplicationConfig = {
  providers: [

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },

    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    provideAuth(() => getAuth()),

    provideFirestore(() => getFirestore()),

    provideStorage(() => getStorage())
  ]
};
