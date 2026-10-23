import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const USE_CASES = [
  {
    title: "Pengiriman File Pribadi",
    id: "use-case-0",
    desc: 'Kirim dokumen sensitif tanpa menarik perhatian. Alih-alih mengirim file terenkripsi yang jelas menunjukkan "ada rahasia di sini", sisipkan file tersebut ke dalam gambar biasa. Penerima dapat mengekstraknya dengan kata sandi yang benar.',
    examples: [
      "Dokumen hukum",
      "Catatan keuangan",
      "Kunci privat atau kredensial",
      "Rekam medis",
    ],
  },
  {
    title: "Komunikasi Terselubung",
    id: "use-case-1",
    desc: "Di wilayah yang memantau atau membatasi pesan terenkripsi, steganografi memungkinkan komunikasi tanpa mengungkapkan keberadaan rahasia. Gambar stego yang dibagikan sebagai foto liburan tidak menimbulkan kecurigaan.",
    examples: [
      "Komunikasi jurnalis",
      "Saluran pelapor pelanggaran",
      "Korespondensi yang sensitif terhadap privasi",
    ],
  },
  {
    title: "Watermark Digital",
    id: "use-case-2",
    desc: "Sisipkan data kepemilikan atau kepengarangan yang tak terlihat ke dalam media digital. Tidak seperti watermark yang terlihat, metadata yang disisipkan dengan LSB tidak dapat dipotong atau dihapus tanpa menurunkan kualitas gambar. Teknik ini digunakan untuk membuktikan kepemilikan dalam sengketa hak cipta.",
    examples: [
      "Hak cipta fotografi",
      "Keaslian dokumen",
      "Lisensi perangkat lunak",
    ],
  },
  {
    title: "Komunikasi Dead Drop",
    id: "use-case-3",
    desc: "Dead drop adalah metode komunikasi ketika pihak-pihak berbagi informasi tanpa kontak langsung. Gambar stego yang diunggah ke situs publik — forum, layanan hosting gambar, atau media sosial — dapat membawa pesan tersembunyi yang hanya bisa diambil oleh penerima yang dituju.",
    examples: [
      "Keamanan operasional",
      "Koordinasi penelitian",
      "Saluran laporan anonim",
    ],
  },
  {
    title: "Cadangan Data dengan Penyangkalan yang Masuk Akal",
    id: "use-case-4",
    desc: "Simpan data cadangan sensitif di dalam file gambar yang tampak biasa pada penyimpanan cloud. Sekalipun akun cloud diakses, gambar-gambarnya terlihat normal. Data tersebut disembunyikan sekaligus dienkripsi dengan AES-256 — dua lapisan perlindungan.",
    examples: [
      "Cadangan kata sandi",
      "File konfigurasi sensitif",
      "Frasa pemulihan mata uang kripto",
    ],
  },
  {
    title: "Riset Keamanan dan Pendidikan",
    id: "use-case-5",
    desc: "Stego.Image sepenuhnya bersifat open-source dan berjalan di sisi klien. Peneliti dan mahasiswa dapat memeriksa kode sumber, menguji teknik steganografi, mempelajari encoding dan decoding LSB, serta bereksperimen dengan steganalisis pada gambar stego yang telah diketahui.",
    examples: [
      "Tugas kuliah",
      "CTF (Capture the Flag) challenges",
      "Pengembangan alat keamanan",
    ],
  },
];

const RELATED = [
  {
    to: "/learn/how-steganography-works",
    label: "Cara Kerja Steganografi",
    desc: "Gambaran umum konsep steganografi",
  },
  {
    to: "/learn/steganography-vs-encryption",
    label: "Steganografi vs Enkripsi",
    desc: "Kapan menggunakan masing-masing teknik",
  },
  {  
    to: "/learn/lsb-steganography",
    label: "Steganografi LSB",
    desc: "Pembahasan teknis mendalam tentang manipulasi bit pada tingkat piksel",
  },
  {
    to: "/learn/aes256-encryption",
    label: "Enkripsi AES-256",
    desc: "Cara data Anda dilindungi sebelum disisipkan",
  },
  {
    to: "/learn/detect-hidden-data",
    label: "Mendeteksi Data Tersembunyi",
    desc: "Cara alat steganalisis mendeteksi konten tersembunyi",
  },
  {
    to: "/learn/image-steganography",
    label: "Steganografi Gambar",
    desc: "Pengaruh format gambar terhadap keutuhan data tersembunyi",
  },
];

function UseCases() {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Kegunaan Steganografi — Penerapan di Dunia Nyata | Stego.Image</title>
        <meta
          name="description"
          content="Jelajahi kegunaan steganografi di dunia nyata — pengiriman file pribadi, komunikasi terselubung, watermark digital, dead drop, pencadangan aman, dan riset keamanan."
        />
        <link
          rel="canonical"
          href="https://stegoimage.pages.dev/learn/use-cases"
        />
        <meta
          property="og:title"
          content="Kegunaan Steganografi — Penerapan di Dunia Nyata | Stego.Image"
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
        <span style={{ color: "var(--text-primary)" }}>Kegunaan</span>
      </nav>

      <div className="row">
        <div className="col-lg-8">
          <h1
            className="text-white mb-2"
            style={{ fontSize: "28px", fontWeight: 700 }}
          >
            Kegunaan Steganografi
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "15px",
              marginBottom: "36px",
              lineHeight: 1.7,
            }}
          >
            Steganografi memiliki penerapan praktis dalam privasi, keamanan,
            jurnalistik, dan hak digital. Berikut beberapa kegunaan paling umum
            untuk menyembunyikan data di dalam gambar.
          </p>

          {/* ── USE CASES ── */}
          {USE_CASES.map(({ id, title, desc, examples }, i) => (
            <section style={{ marginBottom: "36px" }} id={id}>
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
                {i + 1}. {title}
              </h2>
              <p
                style={{
                  color: "var(--text-body)",
                  lineHeight: 1.75,
                  fontSize: "14.5px",
                }}
              >
                {desc}
              </p>
              <div className="about-section" style={{ padding: "14px 18px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "10px",
                    fontWeight: 600,
                  }}
                >
                  Contoh
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {examples.map((ex) => (
                    <span
                      key={ex}
                      style={{
                        fontSize: "12.5px",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        background: "rgba(88,166,255,0.08)",
                        color: "var(--text-body)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          ))}

          {/* ── LEGAL NOTE ── */}
          <section style={{ marginBottom: "30px" }} id="legal">
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
              Pertimbangan Hukum
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Steganografi sendiri legal di sebagian besar wilayah hukum. Ini
              merupakan teknik netral — alat yang sama untuk menjaga privasi
              dapat disalahgunakan. Stego.Image disediakan untuk keperluan
              privasi, penelitian, dan pendidikan yang sah.
            </p>
            <div className="about-limitations">
              {[
                {
                  icon: "✅",
                  title: "Penggunaan legal",
                  desc: "Privasi pribadi, jurnalistik, riset keamanan, watermark digital, pendidikan, tantangan CTF.",
                },
                {
                  icon: "⚠️",
                  title: "Penggunaan ilegal",
                  desc: "Menyembunyikan bukti, mengirimkan konten ilegal, atau menghindari perintah penyadapan yang sah. Stego.Image tidak boleh digunakan untuk kegiatan ilegal.",
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
                {USE_CASES.map(({ title }, i) => (
                  <a
                    key={title}
                    href={`#use-case-${i}`}
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      textDecoration: "none",
                      padding: "4px 0",
                      borderLeft: "2px solid var(--border)",
                      paddingLeft: "10px",
                    }}
                  >
                    {title}
                  </a>
                ))}
                <a
                  href="#legal"
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    padding: "4px 0",
                    borderLeft: "2px solid var(--border)",
                    paddingLeft: "10px",
                  }}
                >
                  Pertimbangan Hukum
                </a>
                <a
                  href="#related"
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    padding: "4px 0",
                    borderLeft: "2px solid var(--border)",
                    paddingLeft: "10px",
                  }}
                >
                  Topik Terkait
                </a>
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

export default UseCases;
