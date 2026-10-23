import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const COMPARISON = [
  {
    property: "Tujuan utama",
    stego: "Menyembunyikan keberadaan data",
    encryption: "Menyembunyikan isi data",
  },
  {
    property: "Tampilan hasil",
    stego: "File gambar biasa",
    encryption: "Data acak yang tak terbaca",
  },
  {
    property: "Dapat dideteksi?",
    stego: "Tidak secara visual",
    encryption: "Ya — ciphertext terlihat jelas",
  },
  { property: "Memerlukan kata sandi?", stego: "Opsional", encryption: "Selalu" },
  {
    property: "Jika terdeteksi, apakah perlindungannya gagal?",
    stego: "Lokasi data terungkap",
    encryption: "Data tetap tak terbaca",
  },
  {
    property: "Jika didekripsi, apakah perlindungannya gagal?",
    stego: "Tidak berlaku",
    encryption: "Seluruh data terungkap",
  },
  {
    property: "Contoh alat",
    stego: "Stego.Image, OpenStego",
    encryption: "AES-256, GPG, VeraCrypt",
  },
  {
    property: "Kegunaan",
    stego: "Komunikasi terselubung, watermark",
    encryption: "Penyimpanan dan pengiriman yang aman",
  },
];

const SCENARIOS = [
  {
    title: "Hanya enkripsi",
    desc: "Anda mengirim file terenkripsi kepada rekan kerja. Siapa pun yang memantau pengiriman akan melihat data terenkripsi dengan jelas — mereka tahu ada rahasia yang dikirim, meskipun tidak dapat membacanya. Dalam situasi tertentu, hal ini saja dapat menimbulkan kecurigaan.",
  },
  {
    title: "Hanya steganografi",
    desc: "Anda menyembunyikan file di dalam gambar tanpa mengenkripsinya. Jika seseorang mendeteksi data tersembunyi lalu mengekstraknya menggunakan alat steganalisis, file tersebut langsung dapat dibaca tanpa kata sandi.",
  },
  {
    title: "Keduanya (cara Stego.Image)",
    desc: "File dienkripsi terlebih dahulu, lalu disembunyikan di dalam gambar. Pengamat hanya melihat gambar biasa. Kalaupun data tersembunyi terdeteksi dan diekstrak, mereka tidak dapat membacanya tanpa kata sandi. Dua lapisan perlindungan yang berdiri sendiri.",
  },
];

const RELATED = [
  {
    to: "/learn/how-steganography-works",
    label: "Cara Kerja Steganografi",
    desc: "Gambaran umum konsep steganografi",
  },
  {
    to: "/learn/aes256-encryption",
    label: "Enkripsi AES-256",
    desc: "Cara data Anda dilindungi sebelum disisipkan",
  },
  {
    to: "/learn/image-steganography",
    label: "Steganografi Gambar",
    desc: "Pengaruh format gambar terhadap keutuhan data tersembunyi",
  },
  {
    to: "/learn/lsb-steganography",
    label: "Steganografi LSB",
    desc: "Cara kerja manipulasi bit pada tingkat piksel",
  },
  {
    to: "/learn/detect-hidden-data",
    label: "Mendeteksi Data Tersembunyi",
    desc: "Cara alat steganalisis mendeteksi konten tersembunyi",
  },
  {
    to: "/learn/use-cases",
    label: "Kegunaan",
    desc: "Kapan menggunakan steganografi, enkripsi, atau keduanya",
  }
];

function SteganographyVsEncryption() {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Steganografi vs Enkripsi — Perbedaan Utama | Stego.Image</title>
        <meta
          name="description"
          content="Pahami perbedaan steganografi dan enkripsi — cara kerja masing-masing, kapan menggunakannya, dan alasan menggabungkan keduanya memberi perlindungan terkuat."
        />
        <link
          rel="canonical"
          href="https://stegoimage.pages.dev/learn/steganography-vs-encryption"
        />
        <meta
          property="og:title"
          content="Steganografi vs Enkripsi — Perbedaan Utama | Stego.Image"
        />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* ── BREADCRUMB ── */}
      <nav style={{ fontSize: "13px", marginBottom: "28px" }}>
        <Link className="custom-link" to="/">
          Beranda
        </Link>
        <span className="mx-2" style={{ color: "var(--text-primary)" }}>
          ›
        </span>
        <span style={{ color: "var(--text-primary)" }}>Pelajari</span>
        <span className="mx-2" style={{ color: "var(--text-primary)" }}>
          ›
        </span>
        <span style={{ color: "var(--text-primary)" }}>
          Steganografi vs Enkripsi
        </span>
      </nav>

      <div className="row">
        <div className="col-lg-8">
          <h1
            className="text-white mb-2"
            style={{ fontSize: "28px", fontWeight: 700 }}
          >
            Steganografi vs Enkripsi
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "15px",
              marginBottom: "36px",
              lineHeight: 1.7,
            }}
          >
            Steganografi dan enkripsi sama-sama digunakan untuk melindungi
            informasi — tetapi keduanya menyelesaikan masalah yang berbeda.
            Memahami perbedaannya membantu Anda memilih pendekatan yang tepat,
            atau menggabungkan keduanya untuk perlindungan maksimal.
          </p>

          {/* ── CORE DIFFERENCE ── */}
          <section style={{ marginBottom: "30px" }} id="core-difference">
            <h2
              className="text-white mb-3"
              style={{
                fontSize: "18px",
                fontWeight: 600,
                paddingBottom: "10px",
                paddingTop: "10px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Perbedaan Utama
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Perbedaan mendasarnya terletak pada <em>apa</em> yang
              disembunyikan oleh setiap teknik:
            </p>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="about-faq-item h-100">
                  <div className="about-faq-q">Enkripsi</div>
                  <div className="about-faq-a">
                    Melindungi <strong>isi</strong> data. Keberadaan data tetap
                    terlihat — tetapi isinya diacak dan tidak dapat dibaca tanpa
                    kunci.
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="about-faq-item h-100">
                  <div className="about-faq-q">Steganografi</div>
                  <div className="about-faq-a">
                    Melindungi <strong>keberadaan</strong> data. Data
                    disembunyikan di dalam file yang tampak biasa — pengamat
                    tidak tahu bahwa ada rahasia di dalamnya.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── COMPARISON TABLE ── */}
          <section style={{ marginBottom: "30px" }} id="comparison">
            <h2
              className="text-white mb-3"
              style={{
                fontSize: "18px",
                fontWeight: 600,
                paddingBottom: "10px",
                paddingTop: "10px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Perbandingan Lengkap
            </h2>
            <div className="about-table-wrapper">
              <table className="about-meta-table">
                <thead>
                  <tr>
                    <th>Karakteristik</th>
                    <th style={{ color: "#58a6ff" }}>Steganografi</th>
                    <th style={{ color: "#3fb950" }}>Enkripsi</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map(({ property, stego, encryption }) => (
                    <tr key={property}>
                      <td
                        style={{
                          color: "var(--text-primary)",
                          fontWeight: 500,
                        }}
                      >
                        {property}
                      </td>
                      <td style={{ color: "var(--text-body)" }}>{stego}</td>
                      <td style={{ color: "var(--text-body)" }}>
                        {encryption}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── SCENARIOS ── */}
          <section style={{ marginBottom: "30px" }} id="scenarios">
            <h2
              className="text-white mb-3"
              style={{
                fontSize: "18px",
                fontWeight: 600,
                paddingBottom: "10px",
                paddingTop: "10px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Tiga Skenario
            </h2>
            <div className="about-steps">
              {SCENARIOS.map(({ title, desc }, i) => (
                <div className="about-step-card" key={title}>
                  <div className="about-step-number">{i + 1}</div>
                  <div>
                    <span
                      className="about-step-title"
                      style={{ fontWeight: 600 }}
                    >
                      {title}
                    </span>
                    <p className="about-step-desc mb-0">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="about-note mt-3">
              Stego.Image selalu menggunakan keduanya. File Anda dienkripsi
              dengan AES-256 sebelum disembunyikan menggunakan steganografi LSB
              — dua lapisan perlindungan yang harus ditembus agar data Anda
              dapat terungkap.
            </div>
          </section>

          {/* ── WEAKNESSES ── */}
          <section style={{ marginBottom: "30px" }} id="weaknesses">
            <h2
              className="text-white mb-3"
              style={{
                fontSize: "18px",
                fontWeight: 600,
                paddingBottom: "10px",
                paddingTop: "10px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Kelemahan Masing-Masing
            </h2>
            <div className="about-limitations">
              {[
                {
                  icon: "⚠️",
                  title: "Kelemahan steganografi",
                  desc: "Jika steganalisis mendeteksi data tersembunyi dan payload tidak dienkripsi, file akan langsung terbuka. Steganografi saja hanya memberikan perlindungan melalui penyamaran.",
                },
                {
                  icon: "⚠️",
                  title: "Kelemahan enkripsi",
                  desc: "Data terenkripsi jelas merupakan rahasia. Di lingkungan yang mengawasi atau membatasi enkripsi, keberadaan ciphertext itu sendiri dapat menjadi masalah.",
                },
                {
                  icon: "✅",
                  title: "Kekuatan jika digabungkan",
                  desc: "Steganografi menyembunyikan keberadaan data. Enkripsi melindunginya jika ditemukan. Penyerang harus mendeteksi data tersembunyi sekaligus membobol AES-256 dengan derivasi kunci PBKDF2.",
                },
              ].map(({ icon, title, desc }) => (
                <div className="about-limitation-item" key={title}>
                  <span className="about-limitation-icon">{icon}</span>
                  <div>
                    <span
                      className="about-step-title"
                      style={{ fontWeight: 600 }}
                    >
                      {title}
                    </span>
                    <p className="about-step-desc mb-0">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── WHEN TO USE ── */}
          <section style={{ marginBottom: "30px" }} id="when-to-use">
            <h2
              className="text-white mb-3"
              style={{
                fontSize: "18px",
                fontWeight: 600,
                paddingBottom: "10px",
                paddingTop: "10px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Kapan Menggunakan Masing-Masing
            </h2>
            <div className="row g-3">
              {[
                {
                  title: "Gunakan enkripsi ketika",
                  desc: "Anda perlu melindungi data saat disimpan atau dikirim, dan keberadaan rahasia itu sendiri bukan hal sensitif. Contoh: cadangan terenkripsi, pesan aman.",
                },
                {
                  title: "Gunakan steganografi ketika",
                  desc: "Keberadaan rahasia harus disembunyikan. Contoh: komunikasi terselubung, menyisipkan metadata kepemilikan tanpa terlihat.",
                },
                {
                  title: "Gunakan keduanya ketika",
                  desc: "Anda memerlukan perlindungan tertinggi — data harus sulit dideteksi dan tetap tak terbaca sekalipun ditemukan. Inilah yang dilakukan Stego.Image.",
                },
              ].map(({ title, desc }) => (
                <div className="col-12" key={title}>
                  <div className="about-faq-item">
                    <div className="about-faq-q">{title}</div>
                    <div className="about-faq-a">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── RELATED ── */}
          <section style={{ marginBottom: "30px" }} id="related">
            <h2
              className="text-white mb-3"
              style={{
                fontSize: "18px",
                fontWeight: 600,
                paddingBottom: "10px",
                paddingTop: "10px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Pelajari Lebih Lanjut
            </h2>
            <div className="d-flex flex-column gap-2">
              {RELATED.map(({ to, label, desc }) => (
                <Link key={to} to={to} style={{ textDecoration: "none" }}>
                  <div className="about-faq-item" style={{ cursor: "pointer" }}>
                    <div
                      className="about-faq-q"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{label}</span>
                      <span style={{ color: "var(--text-muted)" }}>→</span>
                    </div>
                    <div className="about-faq-a">{desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="col-lg-4 d-none d-lg-block">
          <div style={{ position: "sticky", top: "24px" }}>
            <div className="about-section mb-3">
              <div className="about-section-title">Di halaman ini</div>
              <div className="d-flex flex-column gap-1">
                {[
                  { href: "#core-difference", label: "Perbedaan Utama" },
                  { href: "#comparison", label: "Perbandingan Lengkap" },
                  { href: "#scenarios", label: "Tiga Skenario" },
                  { href: "#weaknesses", label: "Kelemahan Masing-Masing" },
                  { href: "#when-to-use", label: "Kapan Menggunakan Masing-Masing" },
                  { href: "#related", label: "Pelajari Lebih Lanjut" },
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      textDecoration: "none",
                      padding: "4px 0",
                      borderLeft: "2px solid var(--border)",
                      paddingLeft: "10px",
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div className="about-section text-center">
              <div className="about-section-title">Coba</div>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginBottom: "14px",
                }}
              >
                Lihat kedua teknik bekerja bersama — gratis, di sisi klien,
                tanpa mengunggah file.
              </p>
              <div className="d-flex flex-column gap-2">
                <Link
                  className="primary-btn justify-content-center"
                  to="/encode"
                >
                  Mulai Menyisipkan
                </Link>
                <Link
                  className="secondary-btn justify-content-center"
                  to="/decode"
                >
                  Ekstrak Data
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SteganographyVsEncryption;
