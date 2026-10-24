import { Helmet } from "react-helmet-async";
import { useState } from "react";

/* ─── Data ───────────────────────────────────────────────────── */
const ENCODE_STEPS = [
  { icon: "📂", title: "Pilih file masukan",           desc: "Unggah gambar penutup tanpa kehilangan kualitas (PNG atau BMP) dan file rahasia yang ingin Anda sembunyikan." },
  { icon: "📦", title: "Kompresi GZIP",           desc: "File rahasia dikompresi dengan DEFLATE (melalui pako) untuk mengurangi ruang piksel yang dibutuhkan." },
  { icon: "🔐", title: "Enkripsi AES-256",         desc: "Jika kata sandi diberikan, data terkompresi dienkripsi dengan AES-256. Penanda terenkripsi pada header diatur agar dekoder tahu bahwa data harus didekripsi." },
  { icon: "🧩", title: "Sisipkan dengan LSB",          desc: "Aliran biner — [panjang metadata 4B][header JSON][payload] — ditulis ke bit paling tidak signifikan pada kanal R, G, dan B dari setiap piksel yang sepenuhnya opak." },
  { icon: "💾", title: "Ekspor PNG",              desc: "Kanvas diekspor sebagai PNG tanpa kehilangan kualitas. Tampilan gambar keluaran sama seperti gambar asli." },
];

const DECODE_STEPS = [
  { icon: "🖼️", title: "Unggah gambar stego",     desc: "Unggah PNG stego. Gambar tidak boleh dikompresi ulang oleh platform yang menggunakan kompresi lossy." },
  { icon: "🔍", title: "Baca LSB",              desc: "Dekoder membaca LSB dari setiap kanal RGB pada semua piksel yang sepenuhnya opak untuk menyusun kembali aliran bit." },
  { icon: "📋", title: "Uraikan metadata",         desc: "Empat byte pertama menunjukkan panjang metadata. Dekoder menguraikan header JSON untuk mengetahui nama file, jenis, ukuran, dan status enkripsinya." },
  { icon: "🔓", title: "Dekripsi",               desc: "Jika metadata.encrypted bernilai true, dekripsi AES-256 dilakukan menggunakan kata sandi yang diberikan. Tombol di antarmuka tidak mengesampingkan penanda ini." },
  { icon: "📤", title: "Dekompresi & validasi", desc: "Payload didekompresi dan panjang byte-nya diperiksa terhadap metadata.size. Ketidakcocokan berarti kata sandi salah atau file rusak." },
];

const TECH_STACK = [
  { name: "React 19",         role: "Kerangka kerja UI",                  pkg: "react" },
  { name: "Vite",             role: "Alat build & server pengembangan",       pkg: "vite" },
  { name: "crypto-js",        role: "Enkripsi/dekripsi AES-256", pkg: "crypto-js" },
  { name: "pako",             role: "Kompresi DEFLATE",           pkg: "pako" },
  { name: "file-saver",       role: "Unduhan file di browser",        pkg: "file-saver" },
  { name: "jszip",            role: "Ekspor ZIP untuk berbagi dengan aman",   pkg: "jszip" },
  { name: "Bootstrap 5",      role: "Utilitas tata letak responsif",   pkg: "bootstrap" },
  { name: "react-dropzone",   role: "Area unggah dengan seret dan lepas",    pkg: "react-dropzone" },
  { name: "react-router-dom", role: "Perutean di sisi klien",           pkg: "react-router-dom" },
  { name: "HTML5 Canvas",     role: "Membaca/menulis piksel secara langsung",       pkg: "(bawaan browser)" },
];

const LIMITATIONS = [
  { icon: "🚫", title: "JPEG tidak didukung",             desc: "Kompresi lossy JPEG mengubah nilai piksel sehingga merusak data LSB. Selalu gunakan PNG atau BMP." },
  { icon: "📏", title: "Kapasitas terbatas",              desc: "Kapasitas = ⌊(piksel opak × 3) / 8⌋ byte. PNG berukuran 1920×1080 dapat menampung sekitar 760 KB payload setelah memperhitungkan overhead." },
  { icon: "📱", title: "Pengodean ulang oleh platform sosial", desc: "WhatsApp, Instagram, dan Telegram mengodekan ulang gambar saat diunggah. Gunakan unduhan ZIP dan bagikan arsipnya." },
  { icon: "🔑", title: "Kata sandi tidak dapat dipulihkan",    desc: "Tidak ada mekanisme pengaturan ulang. Jika kata sandi hilang, data tersembunyi tidak akan dapat diakses lagi." },
  { icon: "👁️", title: "Metadata tidak dienkripsi",       desc: "Header JSON (nama file, MIME, ukuran) disimpan tanpa enkripsi. Siapa pun yang tahu tempat mencarinya dapat membaca informasi ini tanpa kata sandi." },
];

const FAQ = [
  { q: "Mengapa saya tidak bisa langsung membagikan PNG melalui WhatsApp?", a: "WhatsApp mengodekan ulang semua gambar dengan kompresi lossy sehingga menimpa LSB. Gunakan \"Unduh ZIP\" — penerima dapat mengekstrak PNG dan mendekodenya secara lokal." },
  { q: "Apakah tombol enkripsi di halaman Dekode berpengaruh?", a: "Sebagian. Header metadata menyimpan penanda terenkripsi yang menentukan proses dekripsi. Tombol di antarmuka hanya mengatur apakah kolom kata sandi ditampilkan — kata sandi yang benar tetap diperlukan jika penanda tersebut aktif." },
  { q: "Apa yang terjadi jika saya memasukkan kata sandi yang salah?", a: "Dekripsi menghasilkan byte yang tidak bermakna. Dekoder memeriksa panjang hasil dekompresi terhadap metadata.size dan menampilkan kesalahan jika nilainya tidak cocok." },
  { q: "Bisakah saya menyembunyikan file tanpa enkripsi?", a: "Bisa. Matikan tombol enkripsi sebelum menyisipkan file. Payload tetap dikompresi, tetapi tidak memerlukan kata sandi dan siapa pun yang memiliki gambar dapat mendekodenya." },
  { q: "Jenis file apa saja yang bisa disembunyikan?", a: "Semua file biner — PDF, ZIP, gambar, video, file kode, dan sebagainya. Syaratnya hanya file terkompresi harus muat dalam kapasitas piksel gambar." },
  { q: "Apakah ada data yang keluar dari browser saya?", a: "Tidak. Semua proses kompresi, enkripsi, dan steganografi berjalan sepenuhnya di JavaScript. Tidak ada server yang menerima file atau kata sandi Anda." },
];

/* ─── FAQ accordion item ─────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`about-faq-item${open ? " is-open" : ""}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="about-faq-question"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className={`about-faq-icon${open ? " is-open" : ""}`}>+</span>
      </button>
      {open && (
        <div className="about-faq-answer">
          {a}
        </div>
      )}
    </div>
  );
}

/* ─── Pipeline step card ─────────────────────────────────────── */
function StepCard({ icon, title, desc, index, total }) {
  return (
    <div className={`about-pipeline-step${index < total - 1 ? " has-next" : ""}`}>
      {/* connector column */}
      <div className="about-pipeline-connector">
        <div className="about-pipeline-icon">{icon}</div>
        {index < total - 1 && <div className="about-pipeline-line" />}
      </div>
      {/* content */}
      <div className="about-pipeline-content">
        <div className="about-pipeline-heading">
          <span className="about-pipeline-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="about-pipeline-title">{title}</span>
        </div>
        <p className="about-pipeline-desc">{desc}</p>
      </div>
    </div>
  );
}

/* ─── Section wrapper ────────────────────────────────────────── */
function Section({ title, children }) {
  return (
    <section className="about-content-section">
      <h2 className="about-content-heading">{title}</h2>
      {children}
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function About() {
  return (
    <div className="about-page">
      <Helmet>
        <title>Tentang Stego.Image — Alat Steganografi Gratis di Sisi Klien</title>
        <meta name="description" content="Pelajari Stego.Image — alat steganografi sumber terbuka di sisi klien yang dibuat dengan React, enkripsi AES-256, dan pengodean piksel LSB." />
        <link rel="canonical" href="https://stegoimage.pages.dev/about" />
      </Helmet>

      <div className="about-page__content">

        {/* ── HERO ─────────────────────────────────────────── */}
        <div className="about-hero">
          <p className="about-hero__eyebrow">
            Sumber terbuka · Berlisensi MIT
          </p>
          <h1 className="about-hero__title">
            Tentang Stego.Image
          </h1>
          <p className="about-hero__description">
            Alat berbasis browser untuk menyembunyikan dan mengekstrak file di dalam gambar menggunakan
            steganografi dan enkripsi AES-256 opsional — 100% di sisi klien,
            tanpa komunikasi dengan server.
          </p>
        </div>

        {/* ── WHAT IT DOES ─────────────────────────────────── */}
        <Section title="Fungsinya">
          <div className="about-features">
            {[
              { n: "01", kind: "steganography", title: "Steganografi", desc: "Menyembunyikan keberadaan data dengan menuliskannya pada bit paling tidak signifikan dari kanal RGB piksel. Tampilan gambar keluaran tidak dapat dibedakan dari gambar asli." },
              { n: "02", kind: "encryption", title: "Enkripsi",    desc: "Melindungi data dengan AES-256 sehingga sekalipun seseorang menemukan data tersembunyi, mereka tidak dapat membacanya tanpa kata sandi." },
            ].map(({ n, kind, title, desc }) => (
              <div key={n} className={`about-feature-card about-feature-card--${kind}`}>
                <div className="about-feature-card__heading">
                  <span className="about-feature-card__number">{n}</span>
                  <span className="about-feature-card__title">{title}</span>
                </div>
                <p className="about-feature-card__description">{desc}</p>
              </div>
            ))}
          </div>
          <div className="about-note">
            <p className="about-note__text">
              Semua pemrosesan berjalan secara lokal di browser Anda. File, kata sandi, maupun data gambar
              tidak pernah dikirim ke server.
            </p>
          </div>
        </Section>

        {/* ── ENCODE PIPELINE ──────────────────────────────── */}
        <Section title="Alur Penyisipan">
          <div className="about-panel about-pipeline">
            {ENCODE_STEPS.map((step, i) => (
              <StepCard key={step.title} {...step} index={i} total={ENCODE_STEPS.length} />
            ))}
          </div>
        </Section>

        {/* ── DECODE PIPELINE ──────────────────────────────── */}
        <Section title="Alur Ekstraksi">
          <div className="about-panel about-pipeline">
            {DECODE_STEPS.map((step, i) => (
              <StepCard key={step.title} {...step} index={i} total={DECODE_STEPS.length} />
            ))}
          </div>
        </Section>

        {/* ── TECH STACK ───────────────────────────────────── */}
        <Section title="Teknologi yang Digunakan">
          <div className="about-panel about-tech-wrapper">
            <table className="about-tech-table">
              <thead>
                <tr>
                  <th>Pustaka</th>
                  <th>Fungsi</th>
                  <th>Paket</th>
                </tr>
              </thead>
              <tbody>
                {TECH_STACK.map(({ name, role, pkg }) => (
                  <tr key={name}>
                    <td className="about-tech-name">{name}</td>
                    <td>{role}</td>
                    <td><code>{pkg}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── LIMITATIONS ──────────────────────────────────── */}
        <Section title="Batasan">
          <div className="about-limitations-grid">
            {LIMITATIONS.map(({ icon, title, desc }) => (
              <div key={title} className="about-limitation-card">
                <span className="about-limitation-card__icon">{icon}</span>
                <div className="about-limitation-card__content">
                  <p className="about-limitation-card__title">{title}</p>
                  <p className="about-limitation-card__description">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <Section title="Pertanyaan Umum">
          <div className="about-faq-list">
            {FAQ.map(item => <FaqItem key={item.q} {...item} />)}
          </div>
        </Section>

      </div>
    </div>
  );
}