const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const contacts = JSON.parse(fs.readFileSync('./contacts.json', 'utf-8'));

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Scan QR di atas pake WhatsApp lo!');
});

client.on('ready', async () => {
  console.log('✅ Bot siap! Mulai kirim pesan testing...\n');
  await kirimPesanTesting();
  console.log('\n✅ Testing selesai! Bot akan mati dalam 3 detik...');
  setTimeout(() => process.exit(0), 3000);
});

client.on('auth_failure', () => {
  console.error('❌ Autentikasi gagal, coba scan ulang.');
  process.exit(1);
});

// Fungsi kirim pesan testing
async function kirimPesanTesting() {
  console.log(`📨 Mengirim ke ${contacts.length} kontak...\n`);

  for (const contact of contacts) {
    const pesan = buatPesanTesting(contact.name);
    const chatId = `${contact.number}@c.us`;

    try {
      await client.sendMessage(chatId, pesan);
      console.log(`✅ Terkirim ke ${contact.name} (${contact.number})`);
    } catch (err) {
      console.error(`❌ Gagal ke ${contact.name} (${contact.number}): ${err.message}`);
    }

    // Delay random 2-5 detik
    const randomDelay = Math.floor(Math.random() * 3000) + 2000;
    await delay(randomDelay);
  }
}

// Template pesan testing
function buatPesanTesting(nama) {
  return `Halo, ${nama}! 👋\n\nIni adalah pesan testing dari sistem reminder otomatis BPS.\nMohon abaikan pesan ini ya.\n\n— BPS Reminder (Testing)`;
}

// Helper: delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

client.initialize();