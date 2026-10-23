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
    <div style={{
      background: open ? "#1a2030" : "#161b22",
      border: `1px solid ${open ? "rgba(88,166,255,0.3)" : "#30363d"}`,
      borderRadius: 10, overflow: "hidden",
      transition: "border-color 0.25s, background 0.25s",
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, padding: "16px 20px", background: "transparent", border: "none",
        color: "#e6edf3", fontSize: 14, fontWeight: 600, cursor: "pointer",
        fontFamily: "inherit", textAlign: "left",
      }}>
        <span>{q}</span>
        <span style={{
          color: "#58a6ff", fontSize: 18, flexShrink: 0, lineHeight: 1,
          transform: open ? "rotate(45deg)" : "none", transition: "transform 0.25s",
        }}>+</span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 16px", fontSize: 14, color: "#8b949e", lineHeight: 1.75 }}>
          {a}
        </div>
      )}
    </div>
  );
}

/* ─── Pipeline step card ─────────────────────────────────────── */
function StepCard({ icon, title, desc, index, total }) {
  return (
    <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
      {/* connector column */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 16, flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", background: "#161b22",
          border: "1px solid #30363d", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 16, flexShrink: 0,
        }}>{icon}</div>
        {index < total - 1 && (
          <div style={{ width: 1, flex: 1, background: "#30363d", minHeight: 20, margin: "4px 0" }} />
        )}
      </div>
      {/* content */}
      <div style={{ paddingBottom: index < total - 1 ? 24 : 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: "#58a6ff",
            background: "rgba(88,166,255,0.1)", border: "1px solid rgba(88,166,255,0.2)",
            borderRadius: 4, padding: "1px 7px",
          }}>{String(index + 1).padStart(2, "0")}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#e6edf3" }}>{title}</span>
        </div>
        <p style={{ fontSize: 13, color: "#8b949e", lineHeight: 1.7, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Section wrapper ────────────────────────────────────────── */
function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{
        fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 700,
        color: "#e6edf3", marginBottom: 20, paddingBottom: 12,
        borderBottom: "1px solid #30363d", letterSpacing: -0.2,
      }}>{title}</h2>
      {children}
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function About() {
  return (
    <div style={{ background: "#0d1117", color: "#e6edf3" }}>
      <Helmet>
        <title>Tentang Stego.Image — Alat Steganografi Gratis di Sisi Klien</title>
        <meta name="description" content="Pelajari Stego.Image — alat steganografi sumber terbuka di sisi klien yang dibuat dengan React, enkripsi AES-256, dan pengodean piksel LSB." />
        <link rel="canonical" href="https://stegoimage.pages.dev/about" />
      </Helmet>

      <style>{`
        .ab-wrap { max-width:860px; margin:0 auto; padding:64px 24px; }
        .ab-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .ab-tech-table { width:100%; border-collapse:collapse; }
        .ab-tech-table th { font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#8b949e; padding:10px 14px; text-align:left; border-bottom:1px solid #30363d; }
        .ab-tech-table td { font-size:13px; color:#c9d1d9; padding:11px 14px; border-bottom:1px solid #21262d; vertical-align:top; }
        .ab-tech-table tr:last-child td { border-bottom:none; }
        .ab-tech-table tr:nth-child(even) td { background:#111720; }
        .ab-tech-table code { font-size:12px; color:#58a6ff; background:rgba(88,166,255,0.08); border:1px solid rgba(88,166,255,0.15); border-radius:4px; padding:1px 6px; font-family:monospace; }
        @media (max-width:640px) {
          .ab-wrap { padding:40px 16px; }
          .ab-grid-2 { grid-template-columns:1fr; }
          .ab-tech-table th:last-child, .ab-tech-table td:last-child { display:none; }
        }
      `}</style>

      <div className="ab-wrap">

        {/* ── HERO ─────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#8b949e", marginBottom: 12 }}>
            Sumber terbuka · Berlisensi MIT
          </p>
          <h1 style={{ fontSize: "clamp(26px,5vw,42px)", fontWeight: 700, marginBottom: 16, letterSpacing: -0.5 }}>
            Tentang Stego.Image
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "#8b949e", maxWidth: 600, margin: "0 auto" }}>
            Alat berbasis browser untuk menyembunyikan dan mengekstrak file di dalam gambar menggunakan
            steganografi dan enkripsi AES-256 opsional — 100% di sisi klien,
            tanpa komunikasi dengan server.
          </p>
        </div>

        {/* ── WHAT IT DOES ─────────────────────────────────── */}
        <Section title="Fungsinya">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            {[
              { n: "01", c: "#58a6ff", title: "Steganografi", desc: "Menyembunyikan keberadaan data dengan menuliskannya pada bit paling tidak signifikan dari kanal RGB piksel. Tampilan gambar keluaran tidak dapat dibedakan dari gambar asli." },
              { n: "02", c: "#2ea043", title: "Enkripsi",    desc: "Melindungi data dengan AES-256 sehingga sekalipun seseorang menemukan data tersembunyi, mereka tidak dapat membacanya tanpa kata sandi." },
            ].map(({ n, c, title, desc }) => (
              <div key={n} style={{
                flex: "1 1 260px", background: "#161b22", border: `1px solid ${c}22`,
                borderRadius: 12, padding: "20px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: c, lineHeight: 1 }}>{n}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#e6edf3" }}>{title}</span>
                </div>
                <p style={{ fontSize: 13, color: "#8b949e", lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "14px 18px" }}>
            <p style={{ fontSize: 13, color: "#8b949e", lineHeight: 1.75, margin: 0 }}>
              Semua pemrosesan berjalan secara lokal di browser Anda. File, kata sandi, maupun data gambar
              tidak pernah dikirim ke server.
            </p>
          </div>
        </Section>

        {/* ── ENCODE PIPELINE ──────────────────────────────── */}
        <Section title="Alur Penyisipan">
          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "24px 20px" }}>
            {ENCODE_STEPS.map((step, i) => (
              <StepCard key={step.title} {...step} index={i} total={ENCODE_STEPS.length} />
            ))}
          </div>
        </Section>

        {/* ── DECODE PIPELINE ──────────────────────────────── */}
        <Section title="Alur Ekstraksi">
          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "24px 20px" }}>
            {DECODE_STEPS.map((step, i) => (
              <StepCard key={step.title} {...step} index={i} total={DECODE_STEPS.length} />
            ))}
          </div>
        </Section>

        {/* ── TECH STACK ───────────────────────────────────── */}
        <Section title="Teknologi yang Digunakan">
          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, overflow: "hidden" }}>
            <table className="ab-tech-table">
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
                    <td style={{ fontWeight: 600, color: "#e6edf3" }}>{name}</td>
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
          <div className="ab-grid-2">
            {LIMITATIONS.map(({ icon, title, desc }) => (
              <div key={title} style={{
                background: "#161b22", border: "1px solid #30363d",
                borderRadius: 10, padding: "16px 18px",
                display: "flex", gap: 14, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", marginBottom: 5 }}>{title}</p>
                  <p style={{ fontSize: 12, color: "#8b949e", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <Section title="Pertanyaan Umum">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQ.map(item => <FaqItem key={item.q} {...item} />)}
          </div>
        </Section>

      </div>
    </div>
  );
}