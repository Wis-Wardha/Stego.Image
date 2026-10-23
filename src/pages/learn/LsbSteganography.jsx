import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const STEPS = [
  {
    num: 1,
    title: "Ubah payload menjadi biner",
    desc: "File terenkripsi diubah menjadi aliran bit — rangkaian angka 0 dan 1. Setiap byte data menjadi 8 bit.",
  },
  {
    num: 2,
    title: "Baca kanal piksel",
    desc: "Encoder membaca setiap piksel pada gambar sampul. Setiap piksel memiliki tiga kanal: Merah, Hijau, Biru — masing-masing berupa nilai 8-bit antara 0 dan 255.",
  },
  {
    num: 3,
    title: "Ganti bit paling tidak signifikan",
    desc: "Bit terakhir dari nilai setiap kanal diganti dengan satu bit dari payload. 3 kanal per piksel = 3 bit tersembunyi per piksel.",
  },
  {
    num: 4,
    title: "Tulis kembali piksel yang diubah",
    desc: "Nilai piksel yang telah diubah ditulis kembali ke kanvas gambar. Perbedaannya tak terlihat — perubahan maksimum hanya ±1 per kanal.",
  },
  {
    num: 5,
    title: "Ekspor sebagai PNG",
    desc: "Gambar diekspor sebagai PNG lossless agar LSB yang diubah tetap utuh. Format lossy seperti JPEG akan menimpa bit tersembunyi.",
  },
];

const RELATED = [
  {
    to: "/learn/how-steganography-works",
    label: "Cara Kerja Steganografi",
    desc: "Gambaran umum konsep steganografi",
  },
  {
    to: "/learn/image-steganography",
    label: "Steganografi Gambar",
    desc: "PNG vs JPEG dan pertimbangan format",
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
    desc: "Cara alat steganalisis mendeteksi gambar yang dikodekan dengan LSB",
  },
  {
    to: "/learn/use-cases",
    label: "Kegunaan",
    desc: "Kapan menggunakan steganografi, enkripsi, atau keduanya",
  }
];

function LsbSteganography() {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Steganografi LSB — Teknik Bit Paling Tidak Signifikan | Stego.Image</title>
        <meta
          name="description"
          content="Pelajari cara kerja steganografi LSB — menyembunyikan data rahasia pada bit paling tidak signifikan dari piksel gambar. Mencakup encoding biner, kapasitas, dan deteksi."
        />
        <link
          rel="canonical"
          href="https://stegoimage.pages.dev/learn/lsb-steganography"
        />
        <meta property="og:title" content="Steganografi LSB — Teknik Bit Paling Tidak Signifikan | Stego.Image" />
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
        <span style={{ color: "var(--text-primary)" }}>Steganografi LSB</span>
      </nav>

      <div className="row">
        {/* ── MAIN CONTENT ── */}
        <div className="col-lg-8">
          <h1
            className="text-white mb-2"
            style={{ fontSize: "28px", fontWeight: 700 }}
          >
            Steganografi LSB
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "15px",
              marginBottom: "36px",
              lineHeight: 1.7,
            }}
          >
            Steganografi Least Significant Bit (LSB) adalah teknik yang paling
            banyak digunakan untuk menyembunyikan data di dalam gambar. Caranya
            dengan mengganti bit terakhir dari nilai setiap kanal piksel dengan
            satu bit data rahasia — perubahan yang begitu kecil hingga tak
            terlihat oleh mata manusia.
          </p>

          {/* ── WHAT IS LSB ── */}
          <section style={{ marginBottom: "30px" }} id="what-is-lsb">
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
              Apa Itu Bit Paling Tidak Signifikan?
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Every pixel channel value is stored as an 8-bit binary number. In
              an 8-bit number, the{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                bit paling signifikan (MSB)
              </strong>{" "}
              is the leftmost bit — it contributes 128 to the value. The{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                bit paling tidak signifikan (LSB)
              </strong>{" "}
              adalah bit paling kanan — nilainya hanya menyumbang 1.
            </p>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Membalik LSB mengubah nilai piksel paling banyak ±1 dari 255.
              Perubahan kecerahan sebesar 0,4% ini jauh di bawah ambang
              persepsi visual manusia.
            </p>

            <div
              className="about-section"
              style={{ fontFamily: "monospace", fontSize: "13.5px" }}
            >
              <div
                style={{
                  marginBottom: "6px",
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Rincian nilai 8-bit
              </div>
              <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
                {["1", "1", "0", "0", "1", "0", "0", "0"].map((bit, i) => (
                  <div
                    key={i}
                    style={{
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        i === 7
                          ? "rgba(88,166,255,0.15)"
                          : "rgba(255,255,255,0.04)",
                      border: `1px solid ${i === 7 ? "var(--accent-blue)" : "var(--border)"}`,
                      borderRadius: "6px",
                      color:
                        i === 7 ? "var(--accent-blue)" : "var(--text-primary)",
                      fontWeight: i === 7 ? 700 : 400,
                      fontSize: "15px",
                    }}
                  >
                    {bit}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginBottom: "14px",
                }}
              >
                <span>← MSB (bit 7) = 128</span>
                <span>LSB (bit 0) = 1 →</span>
              </div>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>Asli: </span>
                <span style={{ color: "var(--text-primary)" }}>1100100</span>
                <span style={{ color: "var(--text-muted)" }}>0</span>
                <span style={{ color: "var(--text-muted)" }}> = 200</span>
              </div>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>LSB = 0: </span>
                <span style={{ color: "var(--text-primary)" }}>1100100</span>
                <span style={{ color: "#3fb950", fontWeight: 700 }}>0</span>
                <span style={{ color: "var(--text-muted)" }}>
                  {" "}
                  = 200 (bit tersembunyi: 0)
                </span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>LSB = 1: </span>
                <span style={{ color: "var(--text-primary)" }}>1100100</span>
                <span style={{ color: "var(--accent-blue)", fontWeight: 700 }}>
                  1
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  {" "}
                  = 201 (bit tersembunyi: 1)
                </span>
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section style={{ marginBottom: "30px" }} id="encoding">
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
              Cara Kerja Encoding LSB
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
              Kapasitas Penyimpanan
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Dengan menggunakan 1 LSB per kanal, setiap piksel menyimpan 3 bit
              (satu untuk setiap kanal RGB). Kapasitas payload maksimum gambar
              adalah:
            </p>

            <div
              className="about-section"
              style={{ fontFamily: "monospace", fontSize: "13.5px" }}
            >
              <div style={{ marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>
                  Kapasitas (byte) ={" "}
                </span>
                <span style={{ color: "var(--accent-blue)" }}>
                  (width × height × 3) ÷ 8
                </span>
              </div>
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: "10px",
                  marginTop: "10px",
                }}
              >
                <div style={{ marginBottom: "4px" }}>
                  <span style={{ color: "var(--text-muted)" }}>
                    Gambar 1920×1080:{" "}
                  </span>
                  <span style={{ color: "#3fb950" }}>
                    (1920 × 1080 × 3) ÷ 8 = payload maks. ~777 KB
                  </span>
                </div>
                <div style={{ marginBottom: "4px" }}>
                  <span style={{ color: "var(--text-muted)" }}>
                    Gambar 800×600:{" "}
                  </span>
                  <span style={{ color: "#3fb950" }}>
                    (800 × 600 × 3) ÷ 8 = payload maks. ~180 KB
                  </span>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>
                    Gambar 3840×2160:{" "}
                  </span>
                  <span style={{ color: "#3fb950" }}>
                    (3840 × 2160 × 3) ÷ 8 = payload maks. ~3,1 MB
                  </span>
                </div>
              </div>
            </div>

            <div className="about-note mt-3">
              Stego.Image menampilkan kapasitas tersedia secara tepat untuk
              gambar yang Anda unggah sebelum encoding. File rahasia (setelah
              dikompresi dengan GZIP) harus muat dalam batas ini.
            </div>
          </section>

          {/* ── DECODING ── */}
          <section style={{ marginBottom: "30px" }} id="decoding">
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
              Cara Kerja Decoding LSB
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Decoding adalah kebalikan persis dari encoding. Decoder membaca
              LSB dari setiap kanal RGB pada semua piksel secara berurutan untuk
              menyusun kembali aliran bit semula. Bit-bit tersebut dirangkai
              menjadi byte, lalu diurai untuk mengambil header metadata dan
              payload.
            </p>
            <div className="about-steps">
              {[
                {
                  num: 1,
                  title: "Baca LSB secara berurutan",
                  desc: "Decoder membaca bit terakhir dari setiap kanal R, G, B pada semua piksel, dari kiri ke kanan dan dari atas ke bawah.",
                },
                {
                  num: 2,
                  title: "Rangkai kembali aliran bit",
                  desc: "Setiap 8 bit digabungkan menjadi satu byte untuk menyusun kembali payload biner terenkripsi semula.",
                },
                {
                  num: 3,
                  title: "Urai header metadata",
                  desc: "Byte pertama berisi header metadata (nama file, jenis file, ukuran, penanda enkripsi). Informasi ini memberi tahu decoder cara menangani sisa data.",
                },
                {
                  num: 4,
                  title: "Dekripsi dan dekompresi",
                  desc: "Jika dienkripsi, dekripsi AES-256 dilakukan menggunakan kata sandi yang diberikan. Setelah itu, dekompresi GZIP memulihkan file aslinya.",
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

          {/* ── DETECTION ── */}
          <section style={{ marginBottom: "30px" }} id="detection">
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
              Apakah Steganografi LSB Dapat Dideteksi?
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Ya — dalam kondisi tertentu. Alat steganalisis menggunakan
              analisis statistik untuk mendeteksi anomali pada pola LSB yang
              berbeda dari derau alami gambar.
            </p>
            <div className="row g-3">
              {[
                {
                  title: "Pemeriksaan visual",
                  desc: "Tidak mungkin dikenali oleh manusia. Secara visual, gambar yang diubah identik dengan gambar aslinya.",
                },
                {
                  title: "Analisis statistik",
                  desc: "Alat seperti StegExpose dapat mendeteksi distribusi LSB yang tidak biasa pada area gambar yang luas.",
                },
                {
                  title: "Serangan chi-square",
                  desc: "Membandingkan distribusi frekuensi LSB dengan statistik gambar alami yang diharapkan.",
                },
                {
                  title: "Dengan enkripsi",
                  desc: "Enkripsi AES-256 mengacak bit payload sehingga jauh lebih sulit dideteksi melalui analisis statistik.",
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
            <div className="about-note mt-3">
              Selalu gunakan enkripsi saat menyembunyikan data sensitif. Payload
              terenkripsi menghasilkan bit yang tampak acak sehingga jauh lebih
              sulit dibedakan dari derau alami gambar.
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
                  { href: "#what-is-lsb", label: "Apa Itu LSB?" },
                  { href: "#encoding", label: "Cara Kerja Encoding" },
                  { href: "#capacity", label: "Kapasitas Penyimpanan" },
                  { href: "#decoding", label: "Cara Kerja Decoding" },
                  { href: "#detection", label: "Deteksi" },
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
              <div className="about-section-title">Fakta Singkat</div>
              <div className="d-flex flex-column gap-2">
                {[
                  { label: "Bit per piksel", value: "3 (1 per kanal RGB)" },
                  { label: "Perubahan nilai maks.", value: "±1 per kanal" },
                  { label: "Format yang diperlukan", value: "PNG (lossless)" },
                  { label: "Enkripsi", value: "AES-256 melalui crypto-js" },
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
                Lihat steganografi LSB beraksi — gratis, di sisi klien, tanpa
                mengunggah file.
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

export default LsbSteganography;
