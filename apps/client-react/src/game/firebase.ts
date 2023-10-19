// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyA6l-rGy2Q-HvbJg-QHUijy4ZzshauDiWY",
  authDomain: "bounty-rpg.firebaseapp.com",
  databaseURL:
    "https://bounty-rpg-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bounty-rpg",
  storageBucket: "bounty-rpg.appspot.com",
  messagingSenderId: "987827430851",
  appId: "1:987827430851:web:0e01a0d868a1b33ce24976",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// const auth = getAuth();
// auth.useDeviceLanguage();
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//   });
// export const authProvider = new GoogleAuthProvider();

// export async function signIn() {
//   return await signInWithPopup(auth, authProvider)
//     .then((result) => {
//       // This gives you a Google Access Token. You can use it to access the Google API.
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;
//       // The signed-in user info.
//       const user = result.user;
//       // IdP data available using getAdditionalUserInfo(result)
//       // ...
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // The AuthCredential type that was used.
//       const credential = GoogleAuthProvider.credentialFromError(error);
//       // ...
//     });
// }

// // @ts-ignore
// const user = result.user;
// // This gives you a Google Access Token.
// const credential = GoogleAuthProvider.credentialFromResult(result);
// const token = credential.accessToken;
