import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import {
  FaArchive,
  FaArrowDown,
  FaArrowRight,
  FaCheckCircle,
  FaEye,
  FaFileAlt,
  FaImage,
  FaLaptopCode,
  FaLock,
} from "react-icons/fa";
import pixelbg from "../assets/kartikacyberhackathon.png";

/* ─── Typing animation ──────────────────────────────────────── */
function useTyping(phrases) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const target = phrases[idx];
    let timer;
    if (!del && text.length < target.length)
      timer = setTimeout(() => setText(target.slice(0, text.length + 1)), 60);
    else if (!del && text.length === target.length)
      timer = setTimeout(() => setDel(true), 2000);
    else if (del && text.length > 0)
      timer = setTimeout(() => setText(text.slice(0, -1)), 30);
    else {
      setDel(false);
      setIdx(i => (i + 1) % phrases.length);
    }
    return () => clearTimeout(timer);
  }, [text, del, idx, phrases]);
  return text;
}

/* ─── Pixel canvas ──────────────────────────────────────────── */
function PixelGrid() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const COLS = 22, ROWS = 12, CELL = 18, GAP = 9;
    canvas.width = COLS * (CELL + GAP);
    canvas.height = ROWS * (CELL + GAP);
    const pxmage = new Image();//
    pxmage.src = pixelbg;//
    const cells = Array.from({ length: COLS * ROWS }, () => ({
      base: Math.random() > 0.5 ? 1 : 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.8,
    }));
    let frame = 0, raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (pxmage.complete && pxmage.naturalWidth > 0) {
        ctx.save();
        ctx.globalAlpha = 0.90; // Transparansi background
        ctx.drawImage(
          pxmage,
          0,
          0,
          canvas.width,
          canvas.height
        );
        ctx.restore();
      }
      const t = frame * 0.016;
      cells.forEach((cell, i) => {
        const col = i % COLS, row = Math.floor(i / COLS);
        const x = col * (CELL + GAP), y = row * (CELL + GAP);
        const osc = Math.sin(t * cell.speed + cell.phase) * 0.5 + 0.5;
        const lit = cell.base ? osc > 0.35 : osc > 0.88;
        ctx.fillStyle = lit ? `rgba(198,184,117,${0.1 + osc * 0.2})` : "rgba(44,56,39,0.4)";
        ctx.strokeStyle = lit ? "rgba(198,184,117,0.17)" : "rgba(85,88,68,0.4)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.roundRect(x, y, CELL, CELL, 2);
        ctx.fill();
        ctx.stroke();
        // Tampilkan angka biner di tengah cell
        ctx.fillStyle = lit
          ? "rgba(220, 210, 160, 0.9)"
          : "rgba(150, 160, 130, 0.5)";

        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
          cell.base ? "1" : "0",
          x + CELL / 2,
          y + CELL / 2
        );
      });
      frame++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="si-pixel-canvas" aria-hidden="true" />;
}

/* ─── LSB interactive demo ───────────────────────────────────── */
function LsbDemo() {
  const [step, setStep] = useState(0);
  const bits = [1, 0, 1, 1, 0, 0, 1, 0];
  const original = [202, 198, 210, 187, 204, 195, 178, 209];
  const modified = original.map((value, i) => (value & 254) | bits[i]);
  return (
    <div className="si-lsb-demo">
      <p className="si-lsb-label">Demo LSB — nilai kanal piksel</p>
      <div className="lsb-grid">
        {original.map((value, i) => (
          <div key={i} className="si-lsb-item">
            <div className={`si-lsb-value${step === 0 ? "" : " is-encoded"}`}>
              {step === 0 ? value : modified[i]}
            </div>
            <div className="si-lsb-binary">
              {(step === 0 ? value : modified[i]).toString(2).padStart(8, "0")}
            </div>
          </div>
        ))}
      </div>
      <div className="si-lsb-controls">
        <button
          className={`si-lsb-toggle${step === 0 ? "" : " is-encoded"}`}
          onClick={() => setStep(current => 1 - current)}
        >
          {step === 0 ? "Sisipkan bit rahasia →" : "← Tampilkan asli"}
        </button>
        <span className="si-lsb-caption">
          {step === 0 ? "Nilai piksel asli" : "LSB berubah — tampilan tetap sama"}
        </span>
      </div>
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────── */
const FEATURES = [
  { icon: FaLock, title: "Enkripsi AES-256", desc: "Derivasi kunci PBKDF2-SHA256 — 100.000 iterasi, salt acak untuk setiap sesi." },
  { icon: FaImage, title: "Steganografi LSB", desc: "Data disembunyikan pada bit paling tidak signifikan dari kanal RGB. Warna gambar tidak berubah jauh." },
  { icon: FaArchive, title: "Kompresi GZIP", desc: "File dikompresi sebelum disisipkan untuk memaksimalkan kapasitas gambar sampul." },
  { icon: FaLaptopCode, title: "100% di sisi klien", desc: "File rahasia dan gambar tidak tersimpan di server. Semuanya proses Encode/Decode di browser." },
];
const STEPS_ENCODE = [
  { n: "01", label: "Unggah gambar biasa", note: "Hanya PNG atau BMP atau langsung generator gambar dengan AI" },
  { n: "02", label: "Pilih file rahasia", note: "Semua jenis file termasuk naskah yang sudah di Tanda Tangan Digital" },
  { n: "03", label: "Atur Password", note: "File akan dienkripsi dengan algoritma AES-256  (opsional)" },
  { n: "04", label: "Unduh Gambar PNG", note: "Unduh gambar yang telah disisipkan file rahasia" },
];
const STEPS_DECODE = [
  { n: "01", label: "Unggah gambar rahasia", note: "Unggah gambar PNG atau BMP yang telah disisipkan file rahasia" },
  { n: "02", label: "Masukkan Password", note: "Password yang digunakan untuk enkripsi file rahasia (opsional)" },
  { n: "03", label: "Ekstrak File Rahasia", note: "File rahasia akan diekstrak dari gambar steganografi" },
  { n: "04", label: "Verifikasi File", note: "Untuk verifikasi keaslian tanda tangan elektronik (opsional)" },
];
const PIPELINE = [
  { icon: FaFileAlt, label: "File rahasia", tone: "muted" },
  { icon: FaArchive, label: "GZIP", tone: "yellow" },
  { icon: FaLock, label: "AES-256", tone: "green" },
  { icon: FaImage, label: "Sisipkan LSB", tone: "purple" },
  { icon: FaCheckCircle, label: "PNG stego", tone: "yellow" },
];
const SEC_ROWS = [
  ["Derivasi kunci", "PBKDF2-SHA256", "yellow"],
  ["Iterations", "100,000", "yellow"],
  ["Enkripsi", "AES-256", "yellow"],
  ["Kompresi", "DEFLATE", "yellow"],
  ["Permintaan jaringan", "0", "green"],
  ["Penyimpanan di server", "Tidak ada", "green"],
];
const LEARN = [
  { to: "/learn/how-steganography-works", label: "Cara kerja steganografi" },
  { to: "/learn/lsb-steganography", label: "Steganografi LSB" },
  { to: "/learn/aes256-encryption", label: "Enkripsi AES-256" },
  { to: "/learn/steganography-vs-encryption", label: "Steganografi vs. enkripsi" },
  { to: "/learn/detect-hidden-data", label: "Mendeteksi data tersembunyi" },
  { to: "/learn/use-cases", label: "Contoh penggunaan" },
];

/* ─── Component ──────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const typed = useTyping(["Sembunyikan file dalam gambar.", "Enkripsi. Kompresi. Sisipkan.", "Tanpa server. Tanpa jejak."]);

  return (
    <div className="home-page">
      <Helmet>
        <title>Steganografi Online — Sembunyikan File dalam PNG | Stego.Image</title>
        <meta name="description" content="Alat steganografi online gratis. Sembunyikan file apa pun di dalam gambar PNG menggunakan steganografi LSB dan enkripsi AES-256. 100% di sisi klien — tanpa unggahan, server, atau pelacakan." />
        <link rel="canonical" href="https://stegoimage.pages.dev/" />
      </Helmet>

      <section className="si-hero">
        <div className="si-wrap">
          <div className="si-hero-row">
            <div className="si-hero-text">
              <p className="si-eyebrow">Kartika Cyber Hackathon 2026</p>
              <h1 className="si-hero-title">
                <span className="si-accent-yellow">Tool Steganografi</span>
                
              </h1>
              <p className="si-hero-description">
                Sisipkan file apa pun ke dalam PNG menggunakan steganografi LSB dan enkripsi
                AES-256 opsional — sepenuhnya di browser Anda. Tidak ada data yang meninggalkan perangkat.
              </p>
              <div className="si-action-row si-hero-actions">
                <button className="primary-btn" onClick={() => navigate("/encode")}>Encode<span className="si-cursor" aria-hidden="true">/ Unggah</span></button>
                <button className="secondary-btn" onClick={() => navigate("/decode")}>Decode / Unduh</button>
              </div>
              <div className="si-trust-row">
                {[
                  ["Proses secara lokal", "green"],
                  ["AI image generator", "yellow"],
                  ["Verifikasi TTE BSSN", "green"],
                ].map(([label, tone]) => (
                  <span key={label} className="si-trust-badge">
                    <span className={`si-status-dot is-${tone}`} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="si-hero-canvas">
              <div className="si-card si-pixel-card">
                <span className="si-pixel-label">data piksel</span>
                <PixelGrid />
                <div className="si-pixel-badges">
                  <span className="si-pixel-badge"><FaLock aria-hidden="true" /> AES-256</span>
                  <span className="si-pixel-badge"><FaEye aria-hidden="true" /> Steganografi LSB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="si-section">
        <div className="si-wrap">
          <h2 className="si-section-title">Proses Encode</h2>
          <div className="si-card si-steps-grid">
            {STEPS_ENCODE.map(({ n, label, note }) => (
              <div key={n} className="si-step">
                <div className="si-step-number">{n}</div>
                <div>
                  <p className="si-step-title">{label}</p>
                  <p className="si-step-note">{note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="si-pipe-row">
            {PIPELINE.map(({ icon: Icon, label, tone }, i) => (
              <div key={label} className="si-pipe-item">
                {i > 0 && <div className="si-pipe-arrow"><FaArrowRight aria-hidden="true" /></div>}
                <div className={`si-card si-pipe-box is-${tone}`}>
                  <span className="si-pipe-icon"><Icon aria-hidden="true" /></span>
                  <span className="si-pipe-label">{label}</span>
                </div>
              </div>
            ))}
          </div>
          <h2 className="si-section-title">Proses Decode</h2>
          <div className="si-card si-steps-grid">
            {STEPS_DECODE.map(({ n, label, note }) => (
              <div key={n} className="si-step">
                <div className="si-step-number">{n}</div>
                <div>
                  <p className="si-step-title">{label}</p>
                  <p className="si-step-note">{note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="si-action-row si-centered-actions">
            <button className="primary-btn" onClick={() => navigate("/encode")}>Coba Encode</button>
            <button className="secondary-btn" onClick={() => navigate("/about")}>Detail teknis</button>
          </div>
        </div>
      </section>

      <section className="si-layers-section">
        <div className="si-wrap">
          <div className="si-card si-layers">
            {[
              { n: "01", tone: "yellow", title: "Steganografi", desc: "Menyembunyikan keberadaan data di dalam nilai piksel gambar." },
              { sep: "+" },
              { n: "02", tone: "green", title: "Enkripsi", desc: "Melindungi data itu sendiri — tetap tidak terbaca meskipun berhasil diekstrak." },
              { sep: "=" },
              { n: "✓", tone: "purple", title: "Keamanan dua lapis", desc: "Artinya hacker harus menemukan data terlebih dahulu, lalu memecahkan password-nya." },
            ].map((item, i) => item.sep ? (
              <div key={i} className="si-layer-sep">{item.sep}</div>
            ) : (
              <div key={i} className="si-layer-item">
                <div className={`si-layer-number is-${item.tone}`}>{item.n}</div>
                <div>
                  <p className="si-layer-title">{item.title}</p>
                  <p className="si-layer-description">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="si-section">
        <div className="si-wrap">
          <h2 className="si-section-title">Teknologi di baliknya</h2>
          <div className="si-feat-grid">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="si-card si-feature-card">
                <span className="si-feature-icon"><Icon aria-hidden="true" /></span>
                <p className="si-feature-title">{title}</p>
                <p className="si-feature-description">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="si-section">
        <div className="si-wrap">
          <h2 className="si-section-title">Lihat cara kerja LSB</h2>
          <LsbDemo />
          <p className="si-lsb-note">
            Hanya bit terakhir dari setiap byte yang berubah. Tidak ada perbedaan yang terlihat.
          </p>
        </div>
      </section>

      <section className="si-section">
        <div className="si-wrap">
          <h2 className="si-section-title">Pelajari konsepnya</h2>
          <div className="si-learn-grid">
            {LEARN.map(({ to, label }) => (
              <button key={to} className="si-btn-learn" onClick={() => navigate(to)}>
                <span>{label}</span>
                <span className="si-learn-arrow"><FaArrowRight aria-hidden="true" /></span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
