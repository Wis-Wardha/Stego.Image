import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const FORMAT_COMPARISON = [
  {
    property: "Jenis kompresi",
    png: "Tanpa kehilangan (DEFLATE)",
    jpeg: "Dengan kehilangan (DCT)",
  },
  {
    property: "Nilai piksel dipertahankan",
    png: "Ya — persis",
    jpeg: "Tidak — hanya perkiraan",
  },
  {
    property: "Data LSB tetap utuh setelah disimpan",
    png: "Ya",
    jpeg: "Tidak — rusak",
  },
  {
    property: "Ukuran file",
    png: "Lebih besar",
    jpeg: "Lebih kecil",
  },
  {
    property: "Cocok untuk steganografi",
    png: "Ya",
    jpeg: "Tidak",
  },
  {
    property: "Kedalaman warna",
    png: "Hingga 48-bit",
    jpeg: "Hingga 24-bit",
  },
  {
    property: "Dukungan transparansi",
    png: "Ya (kanal alfa)",
    jpeg: "Tidak",
  },
];

const PLATFORMS_TO_AVOID = [
  {
    name: "WhatsApp",
    reason:
      "Mengompresi ulang semua gambar ke JPEG saat dikirim. Data tersembunyi akan rusak.",
  },
  {
    name: "Instagram",
    reason:
      "Menerapkan kompresi lossy pada semua unggahan. Gambar stego tidak akan bertahan.",
  },
  {
    name: "Facebook",
    reason: "Mengodekan ulang gambar di server. Data LSB tidak akan bertahan setelah diunggah.",
  },
  {
    name: "Twitter/X",
    reason:
      "Mengubah PNG menjadi JPEG untuk sebagian besar unggahan. Sebaiknya kirim file secara langsung.",
  },
  {
    name: "Discord",
    reason:
      "Mengompresi gambar yang ukurannya melebihi batas tertentu. Kirim sebagai lampiran file, bukan sebagai gambar.",
  },
];

const SAFE_METHODS = [
  {
    name: "Transfer file langsung",
    desc: "Kirim PNG sebagai lampiran file, bukan sebagai gambar yang disisipkan. Sebagian besar aplikasi pesan mempertahankan file apa adanya.",
  },
  {
    name: "Lampiran email",
    desc: "Lampirkan PNG langsung ke email. Jangan sisipkan sebagai gambar — beberapa aplikasi email mengompresi ulang gambar yang disisipkan.",
  },
  {
    name: "Penyimpanan cloud",
    desc: "Google Drive, Dropbox, dan OneDrive mempertahankan file apa adanya. Bagikan tautan unduhan.",
  },
  {
    name: "GitHub / Pastebin",
    desc: "Upload as a raw file. Useful for sharing with developers.",
  },
];

const RELATED = [
  {
    to: "/learn/how-steganography-works",
    label: "Cara Kerja Steganografi",
    desc: "Gambaran umum konsep steganografi",
  },
  {
    to: "/learn/lsb-steganography",
    label: "Steganografi LSB",
    desc: "Cara kerja manipulasi bit pada tingkat piksel",
  },
  {
    to: "/learn/aes256-encryption",
    label: "Enkripsi AES-256",
    desc: "Cara data Anda dilindungi sebelum disisipkan",
  },
  {
    to: "/learn/steganography-vs-encryption",
    label: "Steganografi vs Enkripsi",
    desc: "Perbandingan lengkap secara berdampingan",
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
  },
];

function ImageSteganography() {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Steganografi Gambar — Sembunyikan Data di Dalam Gambar | Stego.Image</title>
        <meta
          name="description"
          content="Pelajari cara kerja steganografi gambar, alasan PNG diperlukan alih-alih JPEG, pengaruh format file terhadap keutuhan data tersembunyi, dan platform yang merusak gambar stego."
        />
        <link
          rel="canonical"
          href="https://stegoimage.pages.dev/learn/image-steganography"
        />
        <meta property="og:title" content="Steganografi Gambar — Sembunyikan Data di Dalam Gambar | Stego.Image" />
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
          Steganografi Gambar
        </span>
      </nav>

      <div className="row">
        {/* ── MAIN CONTENT ── */}
        <div className="col-lg-8">
          <h1
            className="text-white mb-2"
            style={{ fontSize: "28px", fontWeight: 700 }}
          >
            Steganografi Gambar
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "15px",
              marginBottom: "36px",
              lineHeight: 1.7,
            }}
          >
            Steganografi gambar menyembunyikan data rahasia di dalam nilai piksel
            suatu file gambar. Pemilihan format gambar sangat penting — tidak
            semua format mempertahankan data piksel yang diperlukan agar informasi
            tersembunyi tetap utuh.
          </p>

          {/* ── WHY IMAGES ── */}
          <section style={{ marginBottom: "30px" }} id="why-images">
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
              Mengapa Gambar?
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Gambar merupakan media yang ideal untuk menyembunyikan data karena
              tiga alasan:
            </p>
            <div className="about-steps">
              {[
                {
                  num: 1,
                  title: "Redundansi tinggi",
                  desc: "Gambar biasa berisi jutaan piksel. Dengan mengubah 1 bit per kanal pada sebagian kecil piksel, kita dapat menyimpan banyak data tanpa perubahan yang terlihat pada gambar.",
                },
                {
                  num: 2,
                  title: "Variasi alami",
                  desc: "Gambar di dunia nyata memiliki derau alami dan variasi warna. Perubahan kecil pada LSB menyatu dengan variasi alami ini sehingga lebih sulit dideteksi.",
                },
                {
                  num: 3,
                  title: "Format universal",
                  desc: "Gambar terus dibagikan di berbagai platform dan saluran komunikasi — file gambar stego tidak menimbulkan kecurigaan hanya karena jenis filenya.",
                },
              ].map(({ num, title, desc }) => (
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

          {/* ── PNG VS JPEG ── */}
          <section style={{ marginBottom: "30px" }} id="png-vs-jpeg">
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
              PNG vs JPEG
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Keputusan terpenting dalam steganografi gambar adalah memilih
              format. PNG dan JPEG menangani data piksel dengan cara yang sangat
              berbeda.
            </p>

            <div className="about-table-wrapper">
              <table className="about-meta-table">
                <thead>
                  <tr>
                    <th>Karakteristik</th>
                    <th style={{ color: "#58a6ff" }}>PNG</th>
                    <th style={{ color: "#ff7b72" }}>JPEG</th>
                  </tr>
                </thead>
                <tbody>
                  {FORMAT_COMPARISON.map(({ property, png, jpeg }) => (
                    <tr key={property}>
                      <td
                        style={{
                          color: "var(--text-primary)",
                          fontWeight: 500,
                        }}
                      >
                        {property}
                      </td>
                      <td
                        style={{
                          color:
                            property === "Cocok untuk steganografi"
                              ? "#3fb950"
                              : "var(--text-body)",
                        }}
                      >
                        {png}
                      </td>
                      <td
                        style={{
                          color:
                            property === "Cocok untuk steganografi"
                              ? "#ff7b72"
                              : "var(--text-body)",
                        }}
                      >
                        {jpeg}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="about-note mt-3">
              <strong>Mengapa JPEG tidak cocok:</strong> JPEG menggunakan
              kompresi Discrete Cosine Transform (DCT). Saat disimpan, nilai
              piksel diperkirakan dan dibulatkan. Proses ini menimpa data LSB
              yang ditulis sebelumnya. Data tersembunyi pun rusak secara permanen.
            </div>
          </section>

          {/* ── HOW PNG WORKS ── */}
          <section style={{ marginBottom: "30px" }} id="why-png">
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
              Mengapa PNG Mempertahankan Data Tersembunyi
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              PNG menggunakan kompresi lossless DEFLATE. Artinya, algoritma
              kompresi memperkecil ukuran file tanpa mengubah nilai piksel —
              setiap piksel disimpan dan dibaca kembali persis seperti aslinya.
              LSB yang diubah saat encoding tetap utuh ketika file dibuka.
            </p>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              PNG juga mendukung kanal alfa (transparansi). Stego.Image hanya
              menyisipkan data pada piksel yang sepenuhnya opak — yaitu piksel
              dengan nilai alfa 255. Piksel transparan dilewati agar data
              transparansi tidak rusak.
            </p>

            <div
              className="about-section"
              style={{ fontFamily: "monospace", fontSize: "13px" }}
            >
              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Logika encoding piksel
              </div>
              <div style={{ color: "#3fb950" }}>
                {"// Only encode into fully opaque pixels"}
              </div>
              <div style={{ color: "var(--text-body)" }}>
                {"if (alpha === 255) {"}
              </div>
              <div style={{ paddingLeft: "20px", color: "var(--accent-blue)" }}>
                {"embedBit(R, payloadBit++)"}
              </div>
              <div style={{ paddingLeft: "20px", color: "var(--accent-blue)" }}>
                {"embedBit(G, payloadBit++)"}
              </div>
              <div style={{ paddingLeft: "20px", color: "var(--accent-blue)" }}>
                {"embedBit(B, payloadBit++)"}
              </div>
              <div style={{ color: "var(--text-body)" }}>{"}"}</div>
            </div>
          </section>

          {/* ── CAPACITY ── */}
          <section style={{ marginBottom: "30px" }} id="capacity">
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
              Kapasitas Gambar
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Semakin besar gambar, semakin banyak data yang dapat ditampung.
              Kapasitas bergantung pada jumlah piksel yang sepenuhnya opak dan
              jumlah LSB yang digunakan per kanal (Stego.Image menggunakan 1 LSB
              per kanal).
            </p>

            <div className="row g-3">
              {[
                {
                  size: "800 × 600",
                  cap: "~180 KB",
                  note: "Gambar kecil, hanya untuk file berukuran kecil",
                },
                {
                  size: "1920 × 1080",
                  cap: "~777 KB",
                  note: "Full HD — cocok untuk sebagian besar file",
                },
                {
                  size: "2560 × 1440",
                  cap: "~1.4 MB",
                  note: "QHD — kapasitas cukup besar",
                },
                {
                  size: "3840 × 2160",
                  cap: "~3.1 MB",
                  note: "4K — mendukung file besar",
                },
              ].map(({ size, cap, note }) => (
                <div className="col-md-6" key={size}>
                  <div className="about-faq-item h-100">
                    <div
                      className="about-faq-q"
                      style={{ fontFamily: "monospace" }}
                    >
                      {size}
                    </div>
                    <div
                      style={{
                        color: "#3fb950",
                        fontSize: "16px",
                        fontWeight: 700,
                        margin: "4px 0",
                      }}
                    >
                      {cap}
                    </div>
                    <div className="about-faq-a">{note}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="about-note mt-3">
              Stego.Image menampilkan kapasitas yang tersedia secara tepat
              setelah Anda mengunggah gambar sampul. File rahasia dikompresi
              dengan GZIP sebelum disisipkan — sehingga payload yang dapat
              digunakan sering kali lebih besar daripada ukuran file aslinya.
            </div>
          </section>

          {/* ── PLATFORMS ── */}
          <section style={{ marginBottom: "30px" }} id="platforms">
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
              Platform yang Merusak Data Tersembunyi
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Banyak platform populer mengompresi ulang gambar saat diunggah
              atau dikirim. Proses ini merusak data LSB. Jangan gunakan
              platform-platform berikut untuk mengirim gambar stego:
            </p>
            <div className="about-limitations">
              {PLATFORMS_TO_AVOID.map(({ name, reason }) => (
                <div className="about-limitation-item" key={name}>
                  <span className="about-limitation-icon">⚠️</span>
                  <div>
                    <span
                      className="about-step-title"
                      style={{ fontWeight: 600 }}
                    >
                      {name}
                    </span>
                    <p className="about-step-desc mb-0">{reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SAFE METHODS ── */}
          <section style={{ marginBottom: "30px" }} id="safe-methods">
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
              Cara Aman Mengirim File
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Agar data tersembunyi tetap utuh, selalu kirim gambar stego
              sebagai file — bukan sebagai pratinjau gambar yang disisipkan:
            </p>
            <div className="about-steps">
              {SAFE_METHODS.map(({ name, desc }, i) => (
                <div className="about-step-card" key={name}>
                  <div className="about-step-number">{i + 1}</div>
                  <div>
                    <span
                      className="about-step-title"
                      style={{ fontWeight: 600 }}
                    >
                      {name}
                    </span>
                    <p className="about-step-desc mb-0">{desc}</p>
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
                  { href: "#why-images", label: "Mengapa Gambar?" },
                  { href: "#png-vs-jpeg", label: "PNG vs JPEG" },
                  { href: "#why-png", label: "Mengapa PNG Mempertahankan Data" },
                  { href: "#capacity", label: "Kapasitas Gambar" },
                  { href: "#platforms", label: "Platform yang Merusak Data" },
                  { href: "#safe-methods", label: "Cara Aman Mengirim File" },
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

            <div className="about-section mb-3">
              <div className="about-section-title">Ringkasan Format</div>
              <div className="d-flex flex-column gap-2">
                {[
                  { label: "Format yang diperlukan", value: "PNG" },
                  { label: "Hindari", value: "JPEG, WEBP, GIF" },
                  { label: "Kompresi", value: "Hanya lossless" },
                  { label: "Piksel alfa", value: "Dilewati" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                      paddingBottom: "8px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>{label}</span>
                    <span
                      style={{ color: "var(--text-primary)", fontWeight: 500 }}
                    >
                      {value}
                    </span>
                  </div>
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
                Sembunyikan file apa pun di dalam PNG — gratis, di sisi klien,
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

export default ImageSteganography;
