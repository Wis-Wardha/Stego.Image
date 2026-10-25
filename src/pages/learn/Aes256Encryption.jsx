import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const STEPS = [
  {
    num: 1,
    title: "Derivasi kunci — PBKDF2-SHA256",
    desc: "Kata sandi Anda tidak pernah digunakan langsung sebagai kunci enkripsi. PBKDF2-SHA256 dijalankan sebanyak 100.000 iterasi dengan salt acak 16-byte untuk menghasilkan kunci 256-bit yang kuat. Proses ini membuat serangan brute force membutuhkan banyak komputasi.",
  },
  {
    num: 2,
    title: "Pembuatan salt",
    desc: "Salt acak baru berukuran 16-byte dibuat untuk setiap proses penyandian menggunakan generator angka acak yang aman secara kriptografis. Salt ditambahkan di awal ciphertext agar proses dekripsi dapat menghasilkan kunci yang sama.",
  },
  {
    num: 3,
    title: "Enkripsi AES-256-CBC",
    desc: "Payload yang dikompres dengan GZIP dienkripsi menggunakan AES-256 dalam mode CBC (Cipher Block Chaining). Setiap blok 16-byte di-XOR dengan blok ciphertext sebelumnya sebelum dienkripsi, sehingga blok plaintext yang identik tidak menghasilkan ciphertext yang identik.",
  },
  {
    num: 4,
    title: "Keluaran — salt + ciphertext",
    desc: "Blob terenkripsi akhir berbentuk: [salt 16-byte] + [ciphertext]. Inilah data yang disisipkan ke dalam piksel gambar. Tanpa kata sandi yang benar, data tidak dapat didekripsi.",
  },
];

const DECODE_STEPS = [
  {
    num: 1,
    title: "Ekstrak salt",
    desc: "16 byte pertama dari blob terenkripsi adalah salt yang digunakan saat penyandian.",
  },
  {
    num: 2,
    title: "Derivasikan ulang kunci",
    desc: "PBKDF2-SHA256 dijalankan kembali sebanyak 100.000 iterasi dengan kata sandi yang diberikan dan salt yang diekstrak, sehingga menghasilkan kunci 256-bit yang sama seperti saat penyandian.",
  },
  {
    num: 3,
    title: "Dekripsi dengan AES-256-CBC",
    desc: "Ciphertext didekripsi menggunakan kunci hasil derivasi. Jika kata sandinya salah, kunci hasil derivasi akan berbeda dan dekripsi menghasilkan data tak bermakna — atau gagal sepenuhnya.",
  },
  {
    num: 4,
    title: "Dekompresi GZIP",
    desc: "Payload yang telah didekripsi didekompresi dengan GZIP untuk memulihkan berkas asli. Ketidaksesuaian ukuran dengan header metadata menandakan kata sandi salah atau berkas rusak.",
  },
];

const RELATED = [
  {
    to: "/learn/how-steganography-works",
    label: "Cara Kerja Steganografi",
    desc: "Gambaran umum tentang steganografi dan enkripsi",
  },
  {
    to: "/learn/lsb-steganography",
    label: "Steganografi LSB",
    desc: "Cara payload terenkripsi disembunyikan dalam piksel",
  },
  {
    to: "/learn/steganography-vs-encryption",
    label: "Steganografi vs Enkripsi",
    desc: "Perbandingan lengkap kedua teknik secara berdampingan",
  },
  {
    to: "/learn/detect-hidden-data",
    label: "Deteksi Data Tersembunyi",
    desc: "Mengapa enkripsi sangat mempersulit steganalisis",
  },
  {
    to: "/learn/use-cases",
    label: "Contoh Penggunaan",
    desc: "Kapan menggunakan steganografi, enkripsi, atau keduanya",
  },
  {
    to: "/learn/image-steganography",
    label: "Steganografi Gambar",
    desc: "Cara payload terenkripsi disembunyikan dalam piksel",
  }
];

function Aes256Encryption() {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Penjelasan Enkripsi AES-256 — Cara Melindungi Data Tersembunyi | Stego.Image</title>
        <meta
          name="description"
          content="Pelajari cara Stego.Image menggunakan enkripsi AES-256 dengan derivasi kunci PBKDF2-SHA256 untuk melindungi berkas tersembunyi. Membahas seluruh proses enkripsi dan dekripsi."
        />
        <link
          rel="canonical"
          href="https://stegoimage.pages.dev/learn/aes256-encryption"
        />
        <meta property="og:title" content="Penjelasan Enkripsi AES-256 — Cara Melindungi Data Tersembunyi | Stego.Image" />
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
        <span style={{ color: "var(--text-primary)" }}>Enkripsi AES-256</span>
      </nav>

      <div className="row">
        {/* ── MAIN CONTENT ── */}
        <div className="col-lg-8">
          <h1
            className="text-white mb-2"
            style={{ fontSize: "28px", fontWeight: 700 }}
          >
            Enkripsi AES-256
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "15px",
              marginBottom: "36px",
              lineHeight: 1.7,
            }}
          >
            Sebelum data disembunyikan dalam gambar, Stego.Image mengenkripsinya
            menggunakan AES-256 — standar enkripsi yang sama dengan yang
            digunakan oleh pemerintah, bank, dan perangkat lunak keamanan di
            seluruh dunia. Sekalipun data tersembunyi terdeteksi dan diekstrak,
            data tetap tidak dapat dibaca tanpa kata sandi yang benar.
          </p>

          {/* ── WHAT IS AES ── */}
          <section style={{ marginBottom: "30px" }} id="what-is-aes">
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
              Apa Itu AES-256?
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              AES (Advanced Encryption Standard) adalah standar cipher blok
              simetris yang ditetapkan oleh NIST pada 2001. AES memproses data
              dalam blok 128-bit menggunakan kunci berukuran 128, 192, atau 256
              bit. Stego.Image menggunakan varian 256-bit — yang paling kuat
              tersedia.
            </p>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              AES-256 belum pernah berhasil dibobol. Serangan brute force harus
              mencoba 2<sup>256</sup> kemungkinan kunci — jumlah kombinasi yang
              lebih banyak daripada jumlah atom di alam semesta teramati.
              Keamanan dalam praktik sepenuhnya bergantung pada kekuatan kata
              sandi Anda.
            </p>

            <div className="about-note mt-3">
              <strong>Pustaka yang digunakan:</strong> crypto-js — implementasi
              AES-256 murni dalam JavaScript. Semua proses enkripsi dan dekripsi
              berlangsung sepenuhnya di browser Anda. Kata sandi dan data berkas
              tidak pernah meninggalkan perangkat Anda.
            </div>
          </section>

          {/* ── ENCRYPT PIPELINE ── */}
          <section style={{ marginBottom: "30px" }} id="encrypt">
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
              Alur Enkripsi
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Stego.Image tidak sekadar mengubah kata sandi menjadi kunci.
              Sebelum enkripsi dilakukan, Stego.Image menggunakan proses
              derivasi kunci yang diperkuat:
            </p>
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

          {/* ── PBKDF2 EXPLAINED ── */}
          <section style={{ marginBottom: "30px" }} id="pbkdf2">
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
              Mengapa PBKDF2 Penting
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Kata sandi lemah yang langsung digunakan pada AES mudah ditebak
              dengan brute force — penyerang dapat mencoba jutaan kata sandi
              per detik. PBKDF2 (Password-Based Key Derivation Function 2)
              sengaja membuat setiap percobaan kata sandi membutuhkan banyak
              komputasi dengan menjalankan hashing SHA-256 sebanyak 100.000 kali.
            </p>

            <div
              className="about-section"
              style={{ fontFamily: "Consolas, 'Courier New', monospace", fontSize: "13px" }}
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
                Derivasi kunci
              </div>
              <div>
                <span style={{ color: "#3fb950" }}>{"const"}</span>
                <span style={{ color: "var(--text-primary)" }}>
                  {" salt = "}
                </span>
                <span style={{ color: "var(--accent-blue)" }}>
                  {"CryptoJS.lib.WordArray.random(16)"}
                </span>
              </div>
              <div style={{ marginTop: "4px" }}>
                <span style={{ color: "#3fb950" }}>{"const"}</span>
                <span style={{ color: "var(--text-primary)" }}>
                  {" key  = "}
                </span>
                <span style={{ color: "var(--accent-blue)" }}>
                  {"CryptoJS.PBKDF2(password, salt, {"}
                </span>
              </div>
              <div style={{ paddingLeft: "20px", color: "var(--text-body)" }}>
                {"keySize: 256 / 32,"}
              </div>
              <div style={{ paddingLeft: "20px", color: "var(--text-body)" }}>
                {"iterations: 100000,"}
              </div>
              <div style={{ paddingLeft: "20px", color: "var(--text-body)" }}>
                {"hasher: CryptoJS.algo.SHA256"}
              </div>
              <div style={{ color: "var(--accent-blue)" }}>{"  })"}</div>
            </div>

            <div className="row g-3 mt-2">
              {[
                {
                  title: "Tanpa PBKDF2",
                  desc: "Dengan perangkat keras modern, penyerang dapat mencoba sekitar 1 miliar kata sandi per detik.",
                },
                {
                  title: "Dengan PBKDF2 sebanyak 100 ribu iterasi",
                  desc: "Setiap percobaan memerlukan sekitar 100 ms. Dengan serangan yang sama, hanya sekitar 10 kata sandi yang dapat dicoba per detik.",
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

          {/* ── DECRYPT PIPELINE ── */}
          <section style={{ marginBottom: "30px" }} id="decrypt">
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
              Alur Dekripsi
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Dekripsi adalah kebalikan persis dari enkripsi. Salt yang
              disisipkan dalam payload digunakan untuk menurunkan kembali kunci
              dari kata sandi:
            </p>
            <div className="about-steps">
              {DECODE_STEPS.map(({ num, title, desc }) => (
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

          {/* ── CIPHERTEXT LAYOUT ── */}
          <section style={{ marginBottom: "30px" }} id="layout">
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
              Susunan Payload Terenkripsi
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Blob terenkripsi yang disisipkan ke dalam gambar memiliki susunan
              berikut:
            </p>

            <div
              className="about-section"
              style={{ fontFamily: "Consolas, 'Courier New', monospace", fontSize: "13px" }}
            >
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    background: "rgba(88,166,255,0.12)",
                    border: "1px solid rgba(88,166,255,0.3)",
                    borderRadius: "6px",
                    color: "#58a6ff",
                    fontWeight: 600,
                  }}
                >
                  16 bytes
                  <br />
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 400,
                      color: "var(--text-muted)",
                    }}
                  >
                    Salt acak
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "var(--text-muted)",
                  }}
                >
                  +
                </div>
                <div
                  style={{
                    padding: "10px 14px",
                    background: "rgba(63,185,80,0.10)",
                    border: "1px solid rgba(63,185,80,0.3)",
                    borderRadius: "6px",
                    color: "#3fb950",
                    fontWeight: 600,
                    flex: 1,
                  }}
                >
                  N bytes
                  <br />
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 400,
                      color: "var(--text-muted)",
                    }}
                  >
                    Ciphertext AES-256-CBC
                  </span>
                </div>
              </div>
            </div>

            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
                marginTop: "14px",
              }}
            >
              Salt bukan rahasia — salt disimpan bersama ciphertext. Tujuannya
              adalah memastikan dua berkas identik yang dienkripsi dengan kata
              sandi sama menghasilkan ciphertext yang sepenuhnya berbeda,
              sehingga mencegah serangan berbasis pola.
            </p>
          </section>

          {/* ── PASSWORD TIPS ── */}
          <section style={{ marginBottom: "30px" }} id="password-tips">
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
              Kekuatan Kata Sandi
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Dalam praktiknya, keamanan AES-256 hanya sekuat kata sandi Anda.
              PBKDF2 secara signifikan meningkatkan biaya serangan brute force,
              tetapi kata sandi yang pendek atau umum masih dapat dibobol
              melalui serangan kamus.
            </p>
            <div className="about-limitations">
              {[
                {
                  icon: "✅",
                  title: "Gunakan frasa sandi yang panjang",
                  desc: 'Kalimat seperti "correct-horse-battery-staple" jauh lebih kuat daripada kata sandi pendek yang rumit.',
                },
                {
                  icon: "✅",
                  title: "Hindari kata yang umum",
                  desc: "Satu kata saja, bahkan dengan penggantian karakter (p@ssw0rd), rentan terhadap serangan kamus.",
                },
                {
                  icon: "✅",
                  title: "Gunakan kata sandi unik",
                  desc: "Jangan gunakan ulang kata sandi dari akun lain. Jika salah satu bocor, berkas stego Anda tetap aman.",
                },
                {
                  icon: "⚠️",
                  title: "Kata sandi tidak dapat dipulihkan",
                  desc: "Stego.Image tidak menyediakan pemulihan kata sandi. Jika Anda lupa kata sandi, berkas tersembunyi tidak dapat dipulihkan.",
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
              Lanjutkan Belajar
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
                  { href: "#what-is-aes", label: "Apa Itu AES-256?" },
                  { href: "#encrypt", label: "Alur Enkripsi" },
                  { href: "#pbkdf2", label: "Mengapa PBKDF2 Penting" },
                  { href: "#decrypt", label: "Alur Dekripsi" },
                  { href: "#layout", label: "Susunan Payload" },
                  { href: "#password-tips", label: "Kekuatan Kata Sandi" },
                  { href: "#related", label: "Lanjutkan Belajar" },
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
              <div className="about-section-title">Ringkasan Enkripsi</div>
              <div className="d-flex flex-column gap-2">
                {[
                  { label: "Algoritma", value: "AES-256-CBC" },
                  { label: "KDF", value: "PBKDF2-SHA256" },
                  { label: "Iterasi", value: "100.000" },
                  { label: "Ukuran salt", value: "16 byte (acak)" },
                  { label: "Pustaka", value: "crypto-js" },
                  { label: "Berjalan di", value: "Browser saja" },
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
                Enkripsi dan sembunyikan berkas apa pun dalam PNG — gratis,
                diproses di perangkat, tanpa mengunggah berkas.
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

export default Aes256Encryption;
