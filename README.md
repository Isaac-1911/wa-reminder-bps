# 📲 WA Reminder BPS

Bot WhatsApp otomatis untuk mengirimkan pesan reminder terjadwal kepada pegawai BPS setiap hari Senin–Jumat.

---

## ✨ Fitur

- Kirim pesan otomatis ke banyak kontak sekaligus
- Jadwal pengiriman 2x sehari: **07.30** (pagi) & **18.45** (sore)
- Hanya aktif di hari kerja: **Senin–Jumat**
- Pesan personal dengan nama penerima
- Delay random antar pesan agar lebih natural
- Logging aktivitas ke file `log.txt`
- Auto reconnect jika bot terputus
- File testing untuk uji coba pengiriman langsung

---

## 📁 Struktur Project

```
wa-reminder-bps/
├── index.js          # Bot utama dengan jadwal otomatis
├── testing.js        # Kirim pesan testing sekarang juga
├── contacts.json     # Daftar penerima pesan
├── log.txt           # Log aktivitas (auto-generated)
└── package.json
```

---

## ⚙️ Instalasi

Pastikan **Node.js** sudah terinstall di device kamu.

```bash
# Clone repository
git clone https://github.com/USERNAME_LO/wa-reminder-bps.git
cd wa-reminder-bps

# Install dependencies
npm install
```

---

## 👥 Konfigurasi Kontak

Edit file `contacts.json` dan isi dengan data penerima:

```json
[
  { "name": "Budi Santoso", "number": "6281234567890" },
  { "name": "Siti Rahayu", "number": "6289876543210" }
]
```

> **Format nomor:** `62` + nomor tanpa angka `0` di depan.
> Contoh: `08123456789` → `628123456789`

---

## 🚀 Cara Pakai

### Jalankan bot utama
```bash
node index.js
```
Scan QR yang muncul di terminal menggunakan WhatsApp, bot akan otomatis mengirim pesan sesuai jadwal.

### Uji coba kirim pesan sekarang
```bash
node testing.js
```
Mengirim pesan testing ke semua kontak langsung tanpa menunggu jadwal. Bot akan otomatis berhenti setelah selesai.

---

## 📦 Dependencies

| Package | Fungsi |
|---|---|
| `whatsapp-web.js` | Automasi WhatsApp Web |
| `qrcode-terminal` | Tampilkan QR di terminal |
| `node-cron` | Penjadwalan pesan otomatis |

---

## 📋 Jadwal Pengiriman

| Waktu | Pesan | Hari |
|---|---|---|
| 07.30 WIB | Selamat pagi + semangat kerja | Senin–Jumat |
| 18.45 WIB | Selamat sore + pengingat absen pulang | Senin–Jumat |

---

## ⚠️ Catatan Penting

- Pastikan laptop/server **tetap menyala** dan terkoneksi internet agar bot berjalan
- Gunakan **nomor/akun WhatsApp khusus** untuk bot, bukan nomor pribadi
- Pastikan repo GitHub di-set **private** karena `contacts.json` berisi data nomor pegawai
- Session WhatsApp tersimpan di folder `.wwebjs_auth/` dan tidak ikut ter-push ke GitHub

---

## 🔧 Menjalankan 24/7 dengan PM2

Agar bot tetap berjalan meski terminal ditutup, gunakan PM2:

```bash
# Install PM2
npm install -g pm2

# Jalankan bot dengan PM2
pm2 start index.js --name wa-reminder-bps

# Cek status
pm2 status

# Lihat log
pm2 logs wa-reminder-bps

# Aktifkan auto-start saat device restart
pm2 startup
pm2 save
```
