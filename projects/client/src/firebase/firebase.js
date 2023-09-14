// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = initializeApp({
  apiKey: "AIzaSyAqHYSCcOytIHXRvMfZ_jr2iwmFmwbaPko",
  authDomain: "jcwd240403.firebaseapp.com",
  projectId: "jcwd240403",
  storageBucket: "jcwd240403.appspot.com",
  messagingSenderId: "666143308330",
  appId: "1:666143308330:web:581627d2075161e006e153",
});

const auth = getAuth(firebaseConfig);
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
