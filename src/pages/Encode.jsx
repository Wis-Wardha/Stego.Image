import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { encodeImage } from "../utils/stego";
import { downloadZip } from "../utils/downloadZip";

/**
 * Encode page — lets the user pick a cover image and a secret file,
 * optionally enter a password, then embed the (optionally encrypted)
 * file into the image pixels.
 *
 * Encryption toggle:
 *   ON  → file is GZIP-compressed then AES-256 encrypted before embedding.
 *   OFF → file is GZIP-compressed only; no encryption is applied.
 *         The password field is hidden and irrelevant in this mode.
 */
function Encode() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [useEncrypt, setUseEncrypt] = useState(true); // encryption toggle — ON by default
  const [capacity, setCapacity] = useState(null); // max bytes the image can hold
  const [stegoUrl, setStegoUrl] = useState(null); // object URL of the output PNG
  const [loading, setLoading] = useState(false);
  // First AI
  const [category, setCategory] = useState("dihadiri");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiImageUrl, setAiImageUrl] = useState(null);
  // End AI

  const fileInputRef = useRef();
  const imageInputRef = useRef();
  const canvasRef = useRef();

  // ── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Counts opaque pixels and converts to available byte capacity.
   * Each opaque pixel contributes 3 LSBs (one per RGB channel).
   * @param {File} imgFile
   */
  const calculateCapacity = (imgFile) => {
    const objectUrl = URL.createObjectURL(imgFile);
    const img = new window.Image();
    img.src = objectUrl;

    img.onload = () => {
      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d");
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const pixels = ctx.getImageData(0, 0, img.width, img.height).data;

      // Count only fully opaque pixels (alpha === 255)
      let opaqueCount = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] === 255) opaqueCount++;
      }

      setCapacity(Math.floor((opaqueCount * 3) / 8));
      URL.revokeObjectURL(objectUrl);
    };
  };

  /**
   * Handles file drops on either drop zone.
   * @param {DragEvent} e
   * @param {'image'|'file'} type
   */
  const handleDrop = (e, type) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (!dropped) return;

    if (type === "image") {
      setImage(dropped);
      calculateCapacity(dropped);
    } else {
      setFile(dropped);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  /**
   * Toggles encryption on/off.
   * Clears the password field when turning encryption off.
   */
  const handleToggleEncrypt = () => {
    setUseEncrypt((prev) => {
      if (prev) setPassword(""); // clear password when switching OFF
      return !prev;
    });
  };

  // First AI
  
  const WORKER_URL =
    "https://stegaai-backend.fair-csff7.workers.dev";
  
  const generateAIImage = async () => {
    setGeneratingImage(true);
    setAiError("");
    setStegoUrl(null);
  
    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
  
      const blob = await response.blob();
  
      if (!blob.type.startsWith("image/") || blob.size === 0) {
        throw new Error("Respons AI bukan gambar yang valid.");
      }
  
      const generatedFile = new File(
        [blob],
        `tentara-${category}.png`,
        { type: blob.type }
      );
  
      // Tampilkan preview gambar AI
      const previewUrl = URL.createObjectURL(blob);
  
      setAiImageUrl((oldUrl) => {
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        return previewUrl;
      });
  
      // Jadikan gambar AI sebagai cover image
      setImage(generatedFile);
      calculateCapacity(generatedFile);
    } catch (error) {
      console.error(error);
      setAiError(error.message || "Gagal membuat gambar AI.");
    } finally {
      setGeneratingImage(false);
    }
  };
  // End AI

  // ── Encode ─────────────────────────────────────────────────────────────────

  /**
   * Validates inputs, then loads the cover image and calls encodeImage.
   * Passes password only when encryption is enabled; passes null otherwise
   * so the stego utility knows to skip the encryption step.
   */
  const handleEncode = async () => {
    if (!image || !file) {
      alert("Please provide both a cover image and a secret file.");
      return;
    }

    // Password is required only when encryption is enabled
    if (useEncrypt && !password) {
      alert("Please enter a password, or turn off encryption.");
      return;
    }

    setLoading(true);

    // Rough pre-flight size warning (actual enforcement is in stego.js)
    if (file.size * 2 > capacity) {
      alert("File might be too large for the selected image. Trying anyway…");
    }

    const objectUrl = URL.createObjectURL(image);
    const img = new window.Image();
    img.src = objectUrl;

    img.onload = async () => {
      try {
        // Pass null as password when encryption is OFF so encodeImage skips it
        const result = await encodeImage(
          img,
          file,
          useEncrypt ? password : null,
          canvasRef.current,
        );
        setStegoUrl(result);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      alert("Failed to load image. Please try a different file.");
      setLoading(false);
      URL.revokeObjectURL(objectUrl);
    };
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="encode-container container py-5">
      {/* HELMET */}
      <Helmet>
        <title>Hide a File in an Image Online — LSB Steganography Encoder | Stego.Image</title>
        <meta
          name="description"
          content="Upload an image and a secret file. Stego.Image encrypts and hides it using LSB steganography. 100% client-side, no data leaves your browser."
        />
        <link rel="canonical" href="https://stegoimage.pages.dev/encode" />
      </Helmet>

      {/* Page header */}
      <div className="text-center text-white mb-4">
        <h1>Enkode Data ke dalam Gambar</h1>
        <p className="text-warning small mb-1">
          ⚠️ Baca petunjuk di bawah ini sebelum menyembunyikan data - penggunaan yang salah dapat menyebabkan kehilangan data.
        </p>
        <p>Sematkan file di dalam gambar, dengan enkripsi AES-256 opsional</p>
      </div>

      <div className="row g-4">
        {/* AI Image Generator */}
        <div className="col-12">
          <label className="label-text">Gambar Sampul</label>
          <div className="info-box">
            <h5>✨ Generate Cover Gambar dengan AI</h5>
            <p style={{ fontSize: 13, color: "#8b949e", lineHeight: 1.75, margin: 0 }}>
              Buat Gambar Sampul dengan AI dan bisa generate ulang untuk hasil berbeda.
            </p>
        
            <label className="label-text">
              Instruksi Disposis
            </label>
            
            <select
              className="form-select custom-input mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={generatingImage}
            >
              <option value="dihadiri">Dihadiri</option>
              <option value="dijadwalkan">Dijadwalkan</option>
              <option value="ditindaklanjuti">Ditindaklanjuti</option>
              <option value="dikaji">Dikaji</option>
              <option value="didampingi">Didampingi</option>
              <option value="diketahui">Diketahui</option>
              <option value="dikoordinasikan">Dikoordinasikan</option>
              <option value="diarsipkan">Diarsipkan</option>
              <option value="dimonitor">Dimonitor</option>
              <option value="diwakilkan">Diwakilkan</option>
              <option value="laporan">Sebagai Laporan</option>
            </select>
        
            <button
              type="button"
              className="primary-btn"
              onClick={generateAIImage}
              disabled={generatingImage}
            >
              {generatingImage
                ? "Menghasilkan Gambar..."
                : "Hasilkan Gambar dengan AI"}
            </button>
            
            {generatingImage && (
              <div className="mt-3 text-center">
                <div
                  className="spinner-border text-primary"
                  role="status"
                />
                <p className="mt-2 about-note__text">
                  AI sedang membuat ilustrasi tentara kartun...
                </p>
              </div>
            )}
            
            {aiError && (
              <p className="text-danger mt-2">{aiError}</p>
            )}
            
            {aiImageUrl && (
              <div className="mt-3 text-center about-note__text">
                <h6>Preview Gambar AI</h6>
            
                <img
                  src={aiImageUrl}
                  alt={`Ilustrasi tentara kartun chubby - ${category}`}
                  style={{
                    width: "100%",
                    maxWidth: "350px",
                    borderRadius: "12px",
                    border: "2px solid #ddd",
                    objectFit: "contain",
                  }}
                />
            
                <p className="text-success mt-2">
                  Gambar berhasil dibuat dengan instruksi: {category} , Silahkan generate ulang jika ingin hasil berbeda.
                </p>
              </div>
            )}
            
            {aiError && (
              <p className="text-danger mt-3">
                {aiError}
              </p>
            )}
        
            {image && (
              <div className="mt-3">
                <p className="text-success">
                  Cover image tersedia: {image.name}
                </p>
              </div>
            )}
          </div>
        </div>
       
        {/* Cover image drop zone */}
        <div className="col-md-12">
          <div
            className="drop-zone"
            onDrop={(e) => handleDrop(e, "image")}
            onDragOver={handleDragOver}
            onClick={() => imageInputRef.current.click()}
          >
            <p className="mb-0">Select or drop image</p>
            {image && <span className="file-name">{image.name}</span>}
            <input
              type="file"
              accept="image/*"
              hidden
              ref={imageInputRef}
              onChange={(e) => {
                const f = e.target.files[0];
                setImage(f);
                calculateCapacity(f);
              }}
            />
          </div>
          <p className="about-note__text">
          Bisa ganti dengan gambar PNG/BMP dari perangkat atau langsung pakai gambar dari generator AI.
          </p>
        </div>
        

        {/* Secret file drop zone */}
        <div className="col-md-12">
          <label className="label-text">File Rahasia</label>
          <div
            className="drop-zone"
            onDrop={(e) => handleDrop(e, "file")}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
          >
            <p className="mb-0">Select or drop file</p>
            {file && <span className="file-name">{file.name}</span>}
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>

        {/* Capacity indicator — only shown once an image is chosen */}
        {capacity !== null && (
          <div className="col-12">
            <div className="capacity-box">
              <h6>Estimated Image Capacity</h6>
              <strong>{(capacity / 1024).toFixed(2)} KB</strong>
            </div>
          </div>
        )}

        {/* ── Encryption Toggle ── */}
        <div className="col-12">
          <div className="encrypt-toggle-row">
            {/* Left: label + status badge */}
            <div className="encrypt-toggle-label">
              <span className="label-text mb-0">Encryption</span>
              <span
                className={`encrypt-badge ${useEncrypt ? "badge-on" : "badge-off"}`}
              >
                {useEncrypt ? "🔒 AES-256 ON" : "🔓 OFF"}
              </span>
            </div>

            {/* Right: toggle switch button */}
            <button
              type="button"
              className={`encrypt-toggle-btn ${useEncrypt ? "toggle-on" : "toggle-off"}`}
              onClick={handleToggleEncrypt}
              aria-pressed={useEncrypt}
              aria-label="Toggle AES-256 encryption"
            >
              <span className="toggle-knob" />
            </button>
          </div>

          {/* Contextual hint below the toggle */}
          <p className="encrypt-hint">
            {useEncrypt
              ? "Data akan dienkripsi AES-256 sebelum disisipkan. Password diperlukan untuk mendekode."
              : "Data akan disematkan tanpa enkripsi. Siapa pun yang punya gambarnya bisa mengekstraknya."}
          </p>
        </div>

        {/* Password field — only rendered when encryption is ON */}
        {useEncrypt && (
          <div className="col-12">
            <label className="label-text">Encryption Password</label>
            <input
              type="password"
              className="form-control custom-input"
              placeholder="Enter a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        {/* Encode button */}
        <div className="col-12 text-center">
          <button
            className="primary-btn"
            onClick={handleEncode}
            disabled={loading}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm me-2" />
            )}
            {loading ? "Encoding…" : "Execute Encoding"}
          </button>
        </div>

        {/* Download section — shown after successful encoding */}
        {stegoUrl && (
          <div className="col-12 text-center text-white mt-4">
            <h5>Stego Image Ready</h5>
            <img
              src={stegoUrl}
              alt="encoded stego preview"
              style={{ maxWidth: "300px", borderRadius: "10px" }}
            />
            <div className="mt-3 d-flex gap-3 justify-content-center flex-wrap">
              <a
                href={stegoUrl}
                download="stego-image.png"
                className="primary-btn"
              >
                Download PNG
              </a>
              <button
                className="primary-btn"
                onClick={() => downloadZip(stegoUrl)}
              >
                Download ZIP (Safe Share)
              </button>
            </div>
            <p className="text-warning mt-3 small">
              ⚠️ Sharing the PNG directly via WhatsApp, Instagram, etc. may
              destroy hidden data due to image compression. Use the ZIP option
              for safe sharing.
            </p>
          </div>
        )}
      </div>

      {/* Hidden canvas used by the steganography engine */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Instructions */}
      <div className="info-box mt-4">
        <h5>Intruksi</h5>
        <ul>
          <li>
            Gunakan format <strong>PNG</strong> atau <strong>BMP</strong> atau langsung generator gambar dengan AI — kompresi JPEG akan merusak data tersembunyi.
          </li>
          <li>
            Enkripsi <strong>AKTIF</strong>: gunakan kata sandi yang kuat.{" "}
            <strong>NONAKTIF</strong>: siapa pun dapat mengekstrak data.
          </li>
          <li>Ukuran file rahasia tidak boleh melebihi kapasitas yang ditampilkan di atas.</li>
          <li>
            Gunakan fitur <strong>Download ZIP</strong> untuk berbagi file. Berbagi file PNG secara langsung melalui WhatsApp atau aplikasi lainnya dapat merusak data.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Encode;
