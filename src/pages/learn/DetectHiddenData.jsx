import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const TECHNIQUES = [
  {
    title: "Pemeriksaan visual",
    difficulty: "Mudah",
    effectiveness: "None",
    desc: "Mengamati gambar stego dengan mata telanjang. Perubahan LSB tidak terlihat — perubahan ±1 pada setiap kanal tidak dapat dibedakan. Pemeriksaan visual tidak dapat mendeteksi steganografi LSB.",
  },
  {
    title: "Visualisasi bidang LSB",
    difficulty: "Mudah",
    effectiveness: "Low",
    desc: "Mengekstrak dan memvisualisasikan hanya LSB dari setiap kanal menghasilkan pola menyerupai derau. Pada gambar alami, pola ini tampak acak. Pada gambar stego dengan payload besar, bidang LSB mungkin menunjukkan pola terstruktur — tetapi diperlukan gambar acuan untuk membandingkannya.",
  },
  {
    title: "Serangan chi-kuadrat",
    difficulty: "Sedang",
    effectiveness: "Medium",
    desc: "Membandingkan distribusi frekuensi pasangan nilai piksel (misalnya 200 dan 201) dengan statistik gambar alami yang diharapkan. Penyisipan LSB mengubah distribusi ini dengan cara yang dapat dideteksi — tetapi hanya jika sebagian besar gambar digunakan.",
  },
  {
    title: "Analisis RS",
    difficulty: "Sedang",
    effectiveness: "High",
    desc: "Analisis Regular-Singular (RS) mengukur kehalusan kelompok piksel. Penyisipan data meningkatkan ketidakteraturan dengan cara yang dapat diprediksi. Analisis RS dapat memperkirakan proporsi piksel yang membawa data tersembunyi.",
  },
  {
    title: "StegExpose",
    difficulty: "Rendah (otomatis)",
    effectiveness: "High",
    desc: "Alat steganalisis sumber terbuka yang menggabungkan beberapa uji statistik (chi-kuadrat, RS, pasangan sampel, himpunan primer) untuk mendeteksi steganografi LSB. Efektif untuk gambar dengan payload besar.",
  },
];

const COUNTERMEASURES = [
  {
    title: "Selalu gunakan enkripsi",
    desc: "Payload yang dienkripsi dengan AES-256 menghasilkan bit yang tampak acak. Bit acak sangat mirip dengan profil statistik derau gambar alami, sehingga analisis chi-kuadrat dan RS menjadi jauh kurang efektif.",
  },
  {
    title: "Gunakan payload kecil",
    desc: "Semakin kecil payload dibandingkan ukuran gambar, semakin sulit dideteksi. Anomali statistik meningkat seiring ukuran payload. Gunakan gambar penutup sebesar mungkin.",
  },
  {
    title: "Gunakan gambar dengan banyak detail",
    desc: "Gambar dengan tekstur kompleks dan derau alami — seperti foto alam, kerumunan, atau pemandangan kota — menyamarkan perubahan LSB lebih baik daripada gambar sederhana atau datar seperti logo atau gradasi.",
  },
  {
    title: "Jangan gunakan ulang gambar penutup",
    desc: "Jika penyerang memiliki akses ke gambar penutup asli, serangan perbandingan menjadi mudah dilakukan. Gunakan gambar penutup baru untuk setiap proses penyandian.",
  },
];

const RELATED = [
  {
    to: "/learn/how-steganography-works",
    label: "Cara Kerja Steganografi",
    desc: "Pembahasan teknis mendalam tentang proses penyandian",
  },
  {
    to: "/learn/lsb-steganography",
    label: "Steganografi LSB",
    desc: "Cara kerja manipulasi bit pada tingkat piksel",
  },
  {
    to: "/learn/aes256-encryption",
    label: "Enkripsi AES-256",
    desc: "Mengapa enkripsi membuat deteksi jauh lebih sulit",
  },
  {
    to: "/learn/steganography-vs-encryption",
    label: "Steganografi vs Enkripsi",
    desc: "Perbandingan lengkap kedua teknik",
  },
  {
    to: "/learn/image-steganography",
    label: "Steganografi Gambar",
    desc: "Pengaruh format gambar terhadap keutuhan data tersembunyi",
  },
    {
    to: "/learn/use-cases",
    label: "Contoh Penggunaan",
    desc: "Kapan menggunakan steganografi, enkripsi, atau keduanya",
  },
];

function DetectHiddenData() {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Cara Mendeteksi Data Tersembunyi dalam Gambar — Panduan Steganalisis | Stego.Image</title>
        <meta
          name="description"
          content="Pelajari cara alat steganalisis mendeteksi data tersembunyi dalam gambar. Membahas serangan chi-kuadrat, analisis RS, visualisasi LSB, dan cara enkripsi mempersulit deteksi."
        />
        <link
          rel="canonical"
          href="https://stegoimage.pages.dev/learn/detect-hidden-data"
        />
        <meta
          property="og:title"
          content="Cara Mendeteksi Data Tersembunyi dalam Gambar — Panduan Steganalisis | Stego.Image"
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
        <span style={{ color: "var(--text-primary)" }}>Deteksi Data Tersembunyi</span>
      </nav>

      <div className="row">
        <div className="col-lg-8">
          <h1
            className="text-white mb-2"
            style={{ fontSize: "28px", fontWeight: 700 }}
          >
            Mendeteksi Data Tersembunyi dalam Gambar
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "15px",
              marginBottom: "36px",
              lineHeight: 1.7,
            }}
          >
            Steganalisis adalah praktik mendeteksi konten steganografi dalam
            berkas. Memahami cara kerja deteksi membantu Anda menggunakan
            steganografi dengan lebih efektif — sekaligus memahami batasannya.
          </p>

          {/* ── CAN IT BE DETECTED ── */}
          <section style={{ marginBottom: "30px" }} id="can-it-be-detected">
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
              Bisakah Steganografi LSB Dideteksi?
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Ya — dalam kondisi tertentu. Penyandian LSB tidak terlihat oleh
              mata manusia, tetapi meninggalkan jejak statistik pada data piksel
              yang dapat diukur oleh alat otomatis. Kemungkinan deteksi
              bergantung pada tiga faktor:
            </p>
            <div className="row g-3">
              {[
                {
                  title: "Ukuran payload",
                  desc: "Payload yang lebih besar dibandingkan ukuran gambar meninggalkan jejak statistik yang lebih kuat. Payload kecil dalam gambar besar jauh lebih sulit dideteksi.",
                },
                {
                  title: "Enkripsi",
                  desc: "Payload yang tidak dienkripsi memiliki pola bit terstruktur yang berbeda dari derau gambar alami. Payload terenkripsi bersifat acak secara statistik — jauh lebih sulit dibedakan.",
                },
                {
                  title: "Gambar penutup",
                  desc: "Gambar yang kompleks dan penuh detail menyamarkan perubahan LSB lebih baik daripada gambar datar atau sederhana. Foto merupakan media pembawa yang lebih baik daripada gambar dengan warna datar.",
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

          {/* ── TECHNIQUES ── */}
          <section style={{ marginBottom: "30px" }} id="techniques">
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
              Teknik Deteksi
            </h2>
            <div className="about-steps">
              {TECHNIQUES.map(
                ({ title, difficulty, effectiveness, desc }, i) => (
                  <div className="about-step-card" key={title}>
                    <div className="about-step-number">{i + 1}</div>
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "4px",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        <span
                          className="about-step-title"
                          style={{ fontWeight: 600 }}
                        >
                          {title}
                        </span>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              background: "rgba(88,166,255,0.1)",
                              color: "#58a6ff",
                              border: "1px solid rgba(88,166,255,0.2)",
                            }}
                          >
                            {difficulty}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              background:
                                effectiveness === "None"
                                  ? "rgba(139,148,158,0.1)"
                                  : effectiveness === "Low"
                                    ? "rgba(227,179,65,0.1)"
                                    : effectiveness === "Medium"
                                      ? "rgba(88,166,255,0.1)"
                                      : "rgba(63,185,80,0.1)",
                              color:
                                effectiveness === "None"
                                  ? "#8b949e"
                                  : effectiveness === "Low"
                                    ? "#e3b341"
                                    : effectiveness === "Medium"
                                      ? "#58a6ff"
                                      : "#3fb950",
                              border: `1px solid ${effectiveness === "None" ? "rgba(139,148,158,0.2)" : effectiveness === "Low" ? "rgba(227,179,65,0.2)" : effectiveness === "Medium" ? "rgba(88,166,255,0.2)" : "rgba(63,185,80,0.2)"}`,
                            }}
                          >
                            Efektivitas:{" "}
                            {{
                              None: "Tidak ada",
                              Low: "Rendah",
                              Medium: "Sedang",
                              High: "Tinggi",
                            }[effectiveness]}
                          </span>
                        </div>
                      </div>
                      <p className="about-step-desc mb-0">{desc}</p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* ── COUNTERMEASURES ── */}
          <section style={{ marginBottom: "30px" }} id="countermeasures">
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
              Cara Mempersulit Deteksi
            </h2>
            <div className="about-steps">
              {COUNTERMEASURES.map(({ title, desc }, i) => (
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
              Stego.Image menerapkan enkripsi AES-256 secara default sebelum
              penyisipan. Ini merupakan langkah penangkal paling efektif untuk
              menghadapi steganalisis statistik.
            </div>
          </section>

          {/* ── LIMITS OF DETECTION ── */}
          <section style={{ marginBottom: "30px" }} id="limits">
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
              Batasan Steganalisis
            </h2>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Alat steganalisis saat ini hanya dapat mendeteksi steganografi LSB
              secara andal ketika payload berukuran besar dibandingkan gambar
              dan tidak dienkripsi. Jika payload kecil dan terenkripsi disisipkan
              dalam gambar penutup yang besar dan kompleks, tingkat deteksi
              turun secara signifikan.
            </p>
            <p
              style={{
                color: "var(--text-body)",
                lineHeight: 1.75,
                fontSize: "14.5px",
              }}
            >
              Tidak ada alat steganalisis yang dapat mendeteksi semua konten
              steganografi dalam setiap gambar secara andal. Deteksi bersifat
              probabilistik, bukan pasti. Detektor berbasis deep learning
              tingkat lanjut masih menjadi bidang penelitian aktif dan belum
              sempurna.
            </p>
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
                  { href: "#can-it-be-detected", label: "Bisakah Dideteksi?" },
                  { href: "#techniques", label: "Teknik Deteksi" },
                  { href: "#countermeasures", label: "Mempersulit Deteksi" },
                  { href: "#limits", label: "Batasan Steganalisis" },
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
            <div className="about-section text-center">
              <div className="about-section-title">Coba</div>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginBottom: "14px",
                }}
              >
                Sembunyikan data terenkripsi dalam PNG — gratis, diproses di
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

export default DetectHiddenData;
