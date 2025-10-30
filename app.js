import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");
const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");

// ================== LOGIN SYSTEM ==================
document.getElementById("loginBtn").addEventListener("click", async () => {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!username || !password) return alert("Isi semua kolom!");

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
    localStorage.setItem("login_user", JSON.stringify(loginData));
    alert(`Selamat datang ${username}!`);
    loginPage.classList.add("hidden");
    dashboard.classList.remove("hidden");
  } else {
    alert("Username atau password salah!");
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("login_user");
  dashboard.classList.add("hidden");
  loginPage.classList.remove("hidden");
});

// ================== SIDEBAR TOGGLE ==================
toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// ================== NAVIGATION ==================
document.querySelectorAll("#sidebar li[data-page]").forEach(li => {
  li.addEventListener("click", () => {
    const target = li.getAttribute("data-page");
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(`page-${target}`).classList.add("active");
    sidebar.classList.remove("open");
  });
});

// ================== FITUR SETOR ==================
document.getElementById("setorBtn").addEventListener("click", async () => {
  const gmail = document.getElementById("gmailInput").value.trim();
  const pass = document.getElementById("passInput").value.trim();
  const user = JSON.parse(localStorage.getItem("login_user"));

  if (!gmail || !pass) return alert("Isi semua kolom!");
  if (!user) return alert("Silakan login terlebih dahulu!");

  await addDoc(collection(db, "gmail_jobs"), {
    gmail,
    pass,
    user_id: user.telegram_id,
    username_web: user.web_username,
    telegram_username: user.telegram_username,
    created_at: new Date().toISOString(),
  });

  const BOT_TOKEN = "7993366670:AAEyw6QIsST2MNiWpBS8cgTKIcljzHJTiJA";
  const OWNER_ID = "6736986837";

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: OWNER_ID,
      text: `📩 *Setoran Gmail Baru!*\n👤 ${user.web_username}\n📧 ${gmail}\n🔑 ${pass}`,
      parse_mode: "Markdown",
    }),
  });

  alert("Gmail berhasil disetor!");
  document.getElementById("gmailInput").value = "";
  document.getElementById("passInput").value = "";
});
