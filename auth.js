// /js/auth.js
import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.getElementById("btnLogin").addEventListener("click", async () => {
  const token = document.getElementById("loginToken").value.trim();
  if (!token) return alert("Masukkan token login dari bot Telegram!");

  // Cek ke Firestore apakah token valid
  const docRef = doc(db, "loginTokens", token);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    localStorage.setItem("userData", JSON.stringify(docSnap.data()));
    window.location.href = "dashboard.html";
  } else {
    alert("Token tidak valid atau sudah kadaluarsa.");
  }
});