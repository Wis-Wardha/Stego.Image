import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const STEPS = [
  {
    num: 1,
    title: "Pilih Gambar Penutup",
    desc: "Gambar penutup adalah berkas PNG biasa yang membawa data tersembunyi. PNG diperlukan karena menggunakan kompresi lossless — setiap nilai piksel dipertahankan persis. JPEG merusak data tersembunyi saat disimpan karena menggunakan kompresi lossy.",
  },
  {
    num: 2,
    title: "Kompres Berkas Rahasia",
    desc: "Berkas rahasia dikompres menggunakan GZIP (melalui pako) untuk memperkecil ukurannya sebelum disisipkan. Payload yang lebih kecil memungkinkan lebih banyak jenis berkas dimuat dalam gambar yang sama.",
  },
  {
    num: 3,
    title: "Enkripsi Payload",
    desc: "Data yang telah dikompres dienkripsi menggunakan AES-256 dengan kata sandi Anda melalui crypto-js. Proses ini menghasilkan payload biner terenkripsi. Tanpa kata sandi yang benar, data tidak dapat dibaca meskipun berhasil diekstrak.",
  },
  {
    num: 4,
    title: "Sisipkan dengan Penyandian LSB",
    desc: "Payload terenkripsi disembunyikan pada bit paling tidak signifikan dari nilai piksel gambar. Setiap piksel memiliki kanal RGB — masing-masing berupa angka 8-bit. Mengubah bit terakhir menyebabkan pergeseran warna kurang dari 1% — sepenuhnya tak terlihat oleh mata manusia.",
  },
  {
    num: 5,
    title: "Ekspor Gambar Stego",
    desc: "Gambar hasilnya tampak identik dengan gambar asli dan dapat dibagikan seperti PNG biasa. Hanya orang yang memiliki kata sandi yang benar dan Stego.Image yang dapat mengekstrak isinya.",
  },
];

const RELATED = [
  {
    to: "/learn/lsb-steganography",
    label: "Steganografi LSB",
    desc: "Pembahasan mendalam tentang manipulasi bit pada tingkat piksel",
  },
  {
    to: "/learn/image-steganography",
    label: "Steganografi Gambar",
    desc: "Perbandingan PNG dan JPEG serta kompromi tiap format",
  },
  {
    to: "/learn/aes256-encryption",
    label: "Enkripsi AES-256",
    desc: "Cara melindungi data sebelum disisipkan",
  },
  {
    to: "/learn/detect-hidden-data",
    label: "Deteksi Data Tersembunyi",
    desc: "Cara alat steganalisis mendeteksi konten tersembunyi",
  },
  {
    to: "/learn/steganography-vs-encryption",
    label: "Steganografi vs Enkripsi",
    desc: "Perbandingan lengkap secara berdampingan",
  },
  {
    to: "/learn/use-cases",
    label: "Contoh Penggunaan",
    desc: "Kapan menggunakan steganografi, enkripsi, atau keduanya",
  },
];

function HowSteganographyWorks() {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Cara Kerja Steganografi — Panduan Pemula | Stego.Image</title>
        <meta
          name="description"
          content="Pelajari cara kerja steganografi — teknik menyembunyikan data rahasia dalam berkas gambar biasa menggunakan penyandian LSB dan enkripsi AES-256."
        />
        <link
          rel="canonical"
          href="https://stegoimage.pages.dev/learn/how-steganography-works"
        />
        <meta
          property="og:title"
          content="Cara Kerja Steganografi — Panduan Pemula | Stego.Image"
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
          Cara Kerja Steganografi
        </span>
      </nav>

      <div className="row">
        {/* ── MAIN CONTENT ── */}
        <div className="col-lg-8">
          {/* Title */}
          <h1
            className="text-white mb-2"
            style={{ fontSize: "28px", fontWeight: 700 }}
          >
            Cara Kerja Steganografi
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "15px",
              marginBottom: "36px",
              lineHeight: 1.7,
            }}
          >
            Steganografi adalah praktik menyembunyikan informasi rahasia di
            dalam berkas biasa sehingga keberadaan pesan tersembunyi benar-benar
            tersamarkan.
          </p>

          {/* ── WHAT IS IT ── */}
          <section style={{ marginBottom: "30px" }} id="what-is">
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
              Apa Itu Steganografi?
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Kata ini berasal dari bahasa Yunani <em>steganos</em> (tertutup)
              dan <em>graphia</em> (tulisan) — secara harfiah berarti "tulisan
              tersembunyi." Berbeda dengan enkripsi yang mengacak data agar
              tidak dapat dibaca, steganografi menyembunyikan data agar tidak
              dapat <em>dilihat</em>.
            </p>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Pesan terenkripsi memberi tahu pengamat bahwa "ada data rahasia
              di sini." Pesan steganografi tidak memberi tahu apa pun kepada
              pengamat — rahasianya tak terlihat. Karena itu, steganografi
              efektif untuk komunikasi terselubung: berkas pembawanya tampak
              sepenuhnya normal bagi siapa pun yang memeriksanya.
            </p>

            {/* Info callout */}
            <div className="about-note mt-3">
              <strong>Perbedaan utama</strong> — Enkripsi melindungi{" "}
              <em>isi</em> data. Steganografi menyembunyikan <em>fakta bahwa</em>
              data itu ada. Stego.Image menggunakan keduanya sekaligus.
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section style={{ marginBottom: "30px" }} id="how-it-works">
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
              Cara Kerjanya — Langkah demi Langkah
            </h2>
            <div className="about-steps">
              {STEPS.map(({ num, title, desc }) => (
                <div className="about-step-card" key={num}>
                  <div className="about-step-number">{num}</div>
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

          {/* ── LSB EXPLAINED ── */}
          <section style={{ marginBottom: "30px" }} id="lsb">
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
              Contoh Piksel LSB
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Setiap piksel gambar memiliki kanal warna RGB. Setiap kanal
              berupa angka 8-bit (0–255). Steganografi LSB hanya mengubah 1–2
              bit terakhir dari setiap nilai:
            </p>

            <div
              className="about-section"
              style={{ fontFamily: "monospace", fontSize: "13.5px" }}
            >
              <div style={{ marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>
                  Kanal R piksel asli:{" "}
                </span>
                <span style={{ color: "var(--text-primary)" }}>1100100</span>
                <span style={{ color: "var(--accent-blue)", fontWeight: 700 }}>
                  0
                </span>
                <span style={{ color: "var(--text-muted)" }}> = 200</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>
                  Kanal R piksel yang diubah:{" "}
                </span>
                <span style={{ color: "var(--text-primary)" }}>1100100</span>
                <span style={{ color: "#3fb950", fontWeight: 700 }}>1</span>
                <span style={{ color: "var(--text-muted)" }}>
                  {" "}
                  = 201 ← 1 bit data tersembunyi
                </span>
              </div>
            </div>

            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Nilainya berubah dari 200 menjadi 201 — perbedaan kecerahan
              sebesar 0,4%. Dari 16,7 juta kemungkinan warna RGB, pergeseran ini
              tak terlihat oleh mata manusia. Dengan memanfaatkan jutaan piksel
              dalam gambar biasa, metode ini dapat menyembunyikan seluruh berkas.
            </p>
          </section>

          {/* ── VS ENCRYPTION ── */}
          <section style={{ marginBottom: "30px" }} id="vs-encryption">
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
              Steganografi vs Enkripsi
            </h2>

            <div className="about-table-wrapper">
              <table className="about-meta-table">
                <thead>
                  <tr>
                    <th>Aspek</th>
                    <th>Enkripsi</th>
                    <th>Steganography</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ color: "var(--text-primary)", fontWeight: 500 }}
                    >
                      Yang dilindungi
                    </td>
                    <td>Isi data</td>
                    <td>Keberadaan data</td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "var(--text-primary)", fontWeight: 500 }}
                    >
                      Apakah terlihat?
                    </td>
                    <td>Ya — data yang diacak dapat dideteksi</td>
                    <td>Tidak — tersembunyi di dalam berkas biasa</td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "var(--text-primary)", fontWeight: 500 }}
                    >
                      Membutuhkan
                    </td>
                    <td>Kunci dekripsi atau kata sandi</td>
                    <td>Pengetahuan tentang metode penyembunyian</td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "var(--text-primary)", fontWeight: 500 }}
                    >
                      Contoh
                    </td>
                    <td>AES-256, RSA</td>
                    <td>Penyandian gambar LSB</td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "var(--text-primary)", fontWeight: 500 }}
                    >
                      Kelemahan
                    </td>
                    <td>Penyerang mengetahui adanya rahasia</td>
                    <td>Jika terdeteksi, data mungkin terungkap</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── TWO LAYERS ── */}
          <section style={{ marginBottom: "30px" }} id="two-layers">
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
              Dua Lapisan Keamanan
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Stego.Image menggabungkan kedua teknik tersebut. Berkas Anda
              terlebih dahulu dienkripsi dengan AES-256, lalu disembunyikan
              dalam gambar menggunakan steganografi LSB.
            </p>
            <div className="about-steps">
              <div className="about-step-card">
                <div className="about-step-number">1</div>
                <div>
                  <span
                    className="about-step-title"
                    style={{ fontWeight: 600 }}
                  >
                    Lapisan steganografi
                  </span>
                  <p className="about-step-desc mb-0">
                    Menyembunyikan keberadaan data. Penyerang harus terlebih
                    dahulu mendeteksi bahwa ada data tersembunyi.
                  </p>
                </div>
              </div>
              <div className="about-step-card">
                <div className="about-step-number">2</div>
                <div>
                  <span
                    className="about-step-title"
                    style={{ fontWeight: 600 }}
                  >
                    Lapisan enkripsi
                  </span>
                  <p className="about-step-desc mb-0">
                    Sekalipun data tersembunyi terdeteksi dan diekstrak, enkripsi
                    AES-256 membuatnya tidak dapat dibaca tanpa kata sandi yang
                    benar.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── USE CASES ── */}
          <section style={{ marginBottom: "30px" }} id="use-cases">
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
              Contoh Penggunaan
            </h2>
            <div className="row g-3">
              {[
                {
                  title: "Pengiriman berkas pribadi",
                  desc: "Sembunyikan dokumen sensitif di dalam gambar agar dapat dikirim tanpa menarik perhatian.",
                },
                {
                  title: "Jurnalisme",
                  desc: "Berkomunikasi dengan aman di wilayah yang memantau atau memblokir pesan terenkripsi.",
                },
                {
                  title: "Pemberian tanda air digital",
                  desc: "Sisipkan informasi kepemilikan atau kepengarangan yang tak terlihat ke dalam berkas media digital.",
                },
                {
                  title: "Riset keamanan",
                  desc: "Pelajari teknik steganografi untuk mengembangkan alat deteksi dan forensik yang lebih baik.",
                },
              ].map(({ title, desc }) => (
                <div className="col-md-6" key={title}>
                  <div className="about-faq-item h-100">
                    <div className="about-faq-q">{title}</div>
                    <div className="about-faq-a">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── LIMITATIONS ── */}
          <section style={{ marginBottom: "30px" }} id="limitations">
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
              Keterbatasan
            </h2>
            <div className="about-limitations">
              {[
                {
                  icon: "⚠️",
                  title: "Kapasitas gambar",
                  desc: "Ukuran berkas rahasia tidak boleh melebihi kapasitas gambar. Gambar yang lebih besar dapat menampung payload yang lebih besar.",
                },
                {
                  icon: "⚠️",
                  title: "Hanya PNG",
                  desc: "JPEG dan format lossy lainnya merusak data LSB saat kompresi. Selalu gunakan PNG.",
                },
                {
                  icon: "⚠️",
                  title: "Kompresi ulang",
                  desc: "Mengunggah ke WhatsApp, Instagram, atau platform lain yang mengompresi ulang gambar akan merusak data tersembunyi.",
                },
                {
                  icon: "⚠️",
                  title: "Steganalisis",
                  desc: "Alat analisis statistik tingkat lanjut dapat mendeteksi keberadaan data yang disandikan dengan LSB dalam kondisi tertentu.",
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

          {/* ── RELATED PAGES ── */}
          <section style={{ marginBottom: "30px" }} id="related-pages">
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
              Lanjutkan Belajar
            </h2>
            <div className="d-flex flex-column gap-2">
              {RELATED.map(({ to, label, desc }) => (
                <Link key={to} to={to} style={{ textDecoration: "none" }}>
                  <div
                    className="about-faq-item"
                    style={{
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                  >
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
            {/* On this page */}
            <div className="about-section mb-3">
              <div className="about-section-title">Di halaman ini</div>
              <div className="d-flex flex-column gap-1">
                {[
                  { href: "#what-is", label: "Apa Itu Steganografi?" },
                  { href: "#how-it-works", label: "Cara Kerjanya" },
                  { href: "#lsb", label: "Contoh Piksel LSB" },
                  { href: "#vs-encryption", label: "vs Enkripsi" },
                  { href: "#two-layers", label: "Dua Lapisan Keamanan" },
                  { href: "#use-cases", label: "Contoh Penggunaan" },
                  { href: "#limitations", label: "Keterbatasan" },
                  { href: "#related-pages", label: "Lanjutkan Belajar" },
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

            {/* Try it */}
            <div className="about-section text-center">
              <div className="about-section-title">Coba</div>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginBottom: "14px",
                }}
              >
                Sembunyikan berkas apa pun di dalam gambar — gratis, diproses di
                perangkat, tanpa mengunggah berkas.
              </p>
              <div className="d-flex flex-column gap-2">
                <Link
                  className="primary-btn justify-content-center"
                  to="/encode"
                >
                  Mulai Menyandikan
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

export default HowSteganographyWorks;
