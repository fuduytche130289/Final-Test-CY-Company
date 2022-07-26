// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmYRpTHofR0KdcO4v9pmKfcKhBaQdoq3Y",
    authDomain: "my-chat-app-71613.firebaseapp.com",
    databaseURL: "https://my-chat-app-71613-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "my-chat-app-71613",
    storageBucket: "my-chat-app-71613.appspot.com",
    messagingSenderId: "821567386633",
    appId: "1:821567386633:web:5eecf8a69123b27cd674d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//firestore database //lưu trữ CSDL
const db = getFirestore(app);
const auth = getAuth(app);
export {db, auth};