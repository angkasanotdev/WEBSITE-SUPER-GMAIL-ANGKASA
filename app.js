import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const pages = document.querySelectorAll(".page");

// Sidebar toggle
toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("closed");
});

// Pindah page
document.querySelectorAll("#sidebar li").forEach(li => {
  li.addEventListener("click", () => {
    const target = li.getAttribute("data-page");
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(`page-${target}`).classList.add("active");
  });
});

// ====================================================
//  LOGIN SISTEM
// ====================================================

async function loginUser() {
  const username = prompt("Masukkan Username:");
  const password = prompt("Masukkan Password:");

  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);

  let loginData = null;
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.web_username === username && data.web_password === password) {
      loginData = data;
    }
  });

  if (loginData) {
    alert(`✅ Login berhasil, selamat datang ${username}!`);
    localStorage.setItem("login_user", JSON.stringify(loginData));
  } else {
    alert("❌ Username atau password salah!");
    window.location.reload();
  }
}

window.addEventListener("load", async () => {
  const user = localStorage.getItem("login_user");
  if (!user) await loginUser();
});

// ====================================================
//  FITUR SETOR GMAIL
// ====================================================

document.getElementById("setorBtn").addEventListener("click", async () => {
  const gmail = document.getElementById("gmailInput").value.trim();
  const pass = document.getElementById("passInput").value.trim();
  const user = JSON.parse(localStorage.getItem("login_user"));

  if (!gmail || !pass) return alert("⚠️ Isi semua kolom dulu!");
  if (!user) return alert("⚠️ Silakan login terlebih dahulu!");

  // Simpan ke Firestore
  await addDoc(collection(db, "gmail_jobs"), {
    gmail,
    pass,
    user_id: user.telegram_id,
    username_web: user.web_username,
    telegram_username: user.telegram_username,
    created_at: new Date().toISOString(),
  });

  // Kirim ke bot owner via Telegram API
  const BOT_TOKEN = "7993366670:AAEyw6QIsST2MNiWpBS8cgTKIcljzHJTiJA";
  const OWNER_ID = 6736986837; // Ganti ID owner Telegram

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: OWNER_ID,
      text: `📩 *Setoran Gmail Baru!*\n\n👤 User: ${user.web_username}\n🆔 ID: ${user.telegram_id}\n📧 Gmail: ${gmail}\n🔑 Pass: ${pass}`,
      parse_mode: "Markdown",
    }),
  });

  alert("✅ Gmail berhasil disetor!");
  document.getElementById("gmailInput").value = "";
  document.getElementById("passInput").value = "";
});