const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const fs = require('fs');

const contacts = JSON.parse(fs.readFileSync('./contacts.json', 'utf-8'));

const logFile = fs.createWriteStream('./log.txt', { flags: 'a' });

function log(message) {
  const timestamp = new Date().toLocaleString('id-ID');
  const entry = `[${timestamp}] ${message}`;
  console.log(entry);
  logFile.write(entry + '\n');
}

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  log('Scan QR di atas pake Whatsapp cuyyyyy');
});

client.on('ready', () => {
  log('Bot siap jalan!');
  jadwalkanPesan();
});

client.on('auth_failure', () => {
  log('❌ Autentikasi gagal, coba scan ulang.');
});

client.on('disconnected', (reason) => {
  log(`⚠️ Bot terputus: ${reason}. Mencoba reconnect...`);
  client.initialize();
});

async function kirimPesanKeSemuaKontak(tipePesan) {
  log(`📨 Mulai kirim pesan ${tipePesan} ke ${contacts.length} kontak...`);

  for (const contact of contacts) {
    const pesan = buatPesan(contact.name, tipePesan);
    const chatId = `${contact.number}@c.us`;

    try {
      await client.sendMessage(chatId, pesan);
      log(`✅ Terkirim ke ${contact.name} (${contact.number})`);
    } catch (err) {
      log(`❌ Gagal kirim ke ${contact.name} (${contact.number}): ${err.message}`);
    }

    // Delay random 2-5 detik antar pesan biar lebih natural
    const randomDelay = Math.floor(Math.random() * 3000) + 2000;
    await delay(randomDelay);
  }

  log(`✅ Selesai kirim pesan ${tipePesan}.`);
}

function buatPesan(nama, tipe) {
  const hari = getNamaHari();

  if (tipe === 'pagi') {
    return `Selamat pagi, ${nama}! 🌅\n\nSemangat bekerja hari ${hari} ini. Semoga hari ini berjalan lancar dan produktif, serta jangan lupa absen ya.\n\nSi Rere`;
  } else {
    return `Selamat sore, ${nama}! 🌇\n\nJangan lupa absen pulang dan istirahat yang cukup ya. Sampai jumpa besok!\n\nSi Rere`;
  }
}

function getNamaHari() {
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return hari[new Date().getDay()];
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function jadwalkanPesan() {
  // Jam 07.30 pagi
  cron.schedule('30 7 * * 1-5', () => {
    kirimPesanKeSemuaKontak('pagi');
  }, { timezone: 'Asia/Jakarta' });

  // Jam 18.45 sore
  cron.schedule('45 18 * * 1-5', () => {
    kirimPesanKeSemuaKontak('sore');
  }, { timezone: 'Asia/Jakarta' });

  log('✅ Jadwal aktif: 07.30 & 18.45 (Senin-Jumat, WIB)');
}

client.initialize();