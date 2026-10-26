<p align="center">
  <img src="public/logo.png" alt="Logo Stego.Image" width="200" />
</p>

<h1 align="center">Stego.Image</h1>

<p align="center">
  Sembunyikan file apa pun di dalam gambar — terenkripsi, dikompresi, dan tidak terlihat oleh mata.<br/>
  Seluruh proses berjalan di perangkat Anda. Tanpa server dan tanpa mengunggah file.
</p>

<p align="center">
  <a href="https://stegoimage.pages.dev/">
    <img src="https://img.shields.io/badge/Demo-Live-stegoimage.pages.dev-blue?style=flat-square" />
  </a>
  <img src="https://img.shields.io/badge/lisensi-MIT-green?style=flat-square" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/status-aktif-brightgreen?style=flat-square" />
</p>

---

## Tentang

### Tool Steganografi

Sembunyikan file apa pun di dalam gambar berformat PNG, atau buat gambar langsung menggunakan AI. Lindungi file Anda dengan enkripsi AES-256 (opsional) agar data lebih aman. Seluruh proses dilakukan langsung di browser tanpa menyimpan data di server. Dokumen juga dapat diverifikasi keasliannya menggunakan Tanda Tangan Elektronik (TTE) yang terintegrasi dengan BSSN.

---

## Cara Kerja

```text
File → Kompresi DEFLATE → Enkripsi AES-256 → Sisipkan ke piksel dengan LSB → Hasil PNG
```

**Steganografi LSB (Least Significant Bit / bit paling tidak signifikan)** mengubah bit terakhir pada setiap kanal warna RGB di dalam piksel. Perubahan ini tidak terlihat oleh mata, tetapi dapat digunakan untuk menyimpan data biner di dalam jutaan piksel.

```text
Asli:  1 1 0 0 1 0 1 [0]  = 202
Ubah:  1 1 0 0 1 0 1 [1]  = 203  ← tampilan tetap sama
```

Perlindungan menggunakan dua lapisan yang terpisah:
- **Steganografi** — menyembunyikan keberadaan data
- **Enkripsi** — melindungi isi data jika data tersembunyi ditemukan

---

## Fitur

- **Enkripsi AES-256** — derivasi kunci PBKDF2-SHA256 sebanyak 100.000 iterasi dengan salt acak
- **Kompresi DEFLATE** — mengecilkan data sebelum disisipkan agar kapasitas gambar digunakan secara efisien
- **Steganografi LSB** — menyembunyikan data pada tingkat piksel menggunakan HTML5 Canvas
- **Mendukung berbagai jenis file** — PDF, ZIP, gambar, video, kode, dan dokumen
- **Indikator kapasitas** — menampilkan ruang yang tersedia sebelum proses penyisipan
- **Ekspor ZIP** — mengunduh semua file hasil ekstraksi dalam satu arsip

---

## Keamanan

| Lapisan | Teknologi | Perlindungan |
|---|---|---|
| Steganografi | Penyisipan data pada piksel dengan LSB | Menyamarkan keberadaan file |
| Enkripsi | AES-256 + PBKDF2-SHA256 | Mencegah isi file dibaca tanpa kata sandi |

Kedua lapisan ini bekerja secara terpisah. Jika data tersembunyi ditemukan dan diekstrak, enkripsi AES-256 tetap melindungi isinya tanpa kata sandi yang benar.

> **Privasi:** Semua operasi kriptografi menggunakan `crypto-js` dan berjalan langsung di browser. Kunci enkripsi, teks asli, maupun isi file tidak dikirim ke server.

---

## Teknologi

| Kategori | Teknologi |
|---|---|
| Kerangka kerja | React 19 + Vite |
| Gaya antarmuka | Bootstrap 5 |
| Enkripsi | crypto-js (AES-256, PBKDF2-SHA256) |
| Kompresi | pako (DEFLATE) |
| Penanganan file | file-saver, jszip |
| Unggah file | react-dropzone |
| Perutean halaman | react-router-dom |
| Hosting | Cloudflare Pages |

---

## Instalasi di Linux

Panduan berikut menggunakan Ubuntu/Debian dan `nvm` untuk memasang Node.js 22. Untuk distribusi Linux lain, pasang Git dan curl menggunakan pengelola paket distribusi Anda, lalu lanjutkan ke langkah pemasangan Node.js.

### 1. Pasang Git dan curl

```bash
sudo apt update
sudo apt install -y git curl
```

### 2. Pasang Node.js 22 dengan nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Buka terminal baru, atau muat ulang konfigurasi shell. Untuk Bash:

```bash
source ~/.bashrc
```

Untuk Zsh:

```bash
source ~/.zshrc
```

Lalu pasang dan pilih Node.js 22:

```bash
nvm install 22
nvm use 22
node --version
npm --version
```

Proyek ini memerlukan Node.js `20.19+` atau `22.12+`. Pastikan versi Node.js yang terpasang memenuhi salah satu persyaratan tersebut.

### 3. Unduh proyek dan pasang dependensi

```bash
git clone https://github.com/Wis-Wardha/Stego.Image.git
cd Stego.Image
npm install
```

### 4. Jalankan aplikasi

```bash
npm run dev
```

Buka alamat lokal yang ditampilkan di terminal, biasanya `http://localhost:5173`.

Untuk membuat build produksi:

```bash
npm run build
```

---

## Kontribusi

Kontribusi sangat kami hargai. Baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan menyiapkan lingkungan pengembangan dan berkontribusi.

---

## Lisensi

Lisensi MIT. Lihat [LICENSE](LICENSE) untuk detailnya.
