<!-- /js/firebase.js -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

  const firebaseConfig = {
  apiKey: "AIzaSyBnd_oT956r-6qOfy3tmOeG94-XsQd9WSY",
  authDomain: "database-super.firebaseapp.com",
  projectId: "database-super",
  storageBucket: "database-super.firebasestorage.app",
  messagingSenderId: "241219754589",
  appId: "1:241219754589:web:77674efdd4597eb7968bb4",
  measurementId: "G-4ML339N7Q0"
};

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  export { app, db, auth };
</script>