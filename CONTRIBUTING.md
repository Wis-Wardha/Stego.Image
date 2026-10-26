# Panduan Kontribusi Stego.Image

Terima kasih telah membantu mengembangkan proyek ini. Panduan ini dibuat agar mudah diikuti, termasuk oleh kontributor pemula.

## Persyaratan

Pastikan perangkat Anda memiliki:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org) versi `20.19+` atau `22.12+`

## Menyiapkan Proyek

```bash
git clone https://github.com/Wis-Wardha/Stego.Image.git
cd Stego.Image
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan di terminal, biasanya `http://localhost:5173`.

Jika menggunakan Linux, lihat bagian [Instalasi di Linux](README.md#instalasi-di-linux) pada README untuk panduan memasang Git, curl, dan Node.js.

## Membuat Branch

Jangan mengerjakan perubahan langsung di branch `main`. Buat branch baru untuk setiap perubahan.

```bash
git checkout -b fix/typo-on-encode-page
```

### Pola Penamaan Branch

| Awalan | Digunakan untuk | Contoh |
|---|---|---|
| `feat/` | Fitur baru | `feat/add-image-preview` |
| `fix/` | Perbaikan bug | `fix/encode-button-error` |
| `docs/` | Dokumentasi | `docs/improve-contributing-guide` |
| `chore/` | Perapian atau pemeliharaan kecil | `chore/update-dependencies` |

## Membuat Perubahan

Buat perubahan yang terarah dan mudah ditinjau.

- Tangani satu masalah dalam satu waktu.
- Pastikan kode mudah dibaca.
- Uji aplikasi melalui browser sebelum mengirimkan perubahan.

## Membuat Commit

Setelah perubahan selesai, buat commit dengan pesan yang menjelaskan isinya.

```bash
git status
git add .
git commit -m "fix: correct typo on encode page"
```

### Contoh Pesan Commit yang Baik

```text
feat: add file size warning before encoding
fix: prevent crash when image is too small
docs: improve contributor instructions
```

### Hindari Pesan Commit yang Tidak Jelas

```text
update stuff
fix
asdfgh
```

## Mengirim Perubahan dan Membuka Pull Request

```bash
git push origin fix/typo-on-encode-page
```

Setelah itu, buka pull request di GitHub dan jelaskan:

- apa yang diubah;
- alasan perubahan tersebut; dan
- cara Anda menguji perubahan.

## Pedoman

- Bersikap sopan dan saling menghargai.
- Batasi setiap pull request pada satu tujuan.
- Jangan menambahkan pelacak, analitik, atau API eksternal tanpa diskusi terlebih dahulu.
- Diskusikan perubahan desain yang besar sebelum mengerjakannya.

## Butuh Bantuan?

Jika mengalami kendala, mintalah bantuan melalui issue atau pull request. Perbaikan kecil seperti typo, teks, atau tampilan merupakan cara yang baik untuk mulai berkontribusi.
