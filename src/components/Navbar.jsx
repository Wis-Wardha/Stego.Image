import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";

const NAV_LINKS = [
  { to: "/",        label: "Home" },
  { to: "/encode",  label: "Encode" },
  { to: "/decode",  label: "Decode" },
  { to: "/about",   label: "About" },
];

const LEARN_LINKS = [
  { to: "/learn/how-steganography-works",     label: "How Steganography Works" },
  { to: "/learn/lsb-steganography",           label: "LSB Steganography" },
  { to: "/learn/image-steganography",         label: "Image Steganography" },
  { to: "/learn/aes256-encryption",           label: "AES-256 Encryption" },
  { to: "/learn/steganography-vs-encryption", label: "Steganography vs Encryption" },
  { to: "/learn/detect-hidden-data",          label: "Detect Hidden Data" },
  { to: "/learn/use-cases",                   label: "Use Cases" },
];

const GH = "https://youtube.com";

export default function Navbar() {
  const location                  = useLocation();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const navRef                    = useRef(null);

  const isLearnActive = LEARN_LINKS.some(l => location.pathname === l.to);
  const isActive      = to => location.pathname === to;

  const closeMenus = () => {
    setMenuOpen(false);
    setLearnOpen(false);
  };

  /* close everything on route change */
  useEffect(() => {
    closeMenus();
  }, [location.pathname]);

  /* close on outside click */
  useEffect(() => {
    function handler(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeMenus();
      }
    }
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return (
    <>
      {/* Fixed navbar */}
      <nav ref={navRef} className="custom-navbar site-navbar">

        {/* Brand */}
        <Link to="/" onClick={closeMenus} className="site-navbar__brand">
          <img src={logo} alt="Stego.Image" width={50} height={50} />
          SENTINEL INTEL
        </Link>

        {/* Desktop links */}
        <div className="site-navbar__desktop">

          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`site-navbar__link${isActive(to) ? " is-active" : ""}`}
            >
              {label}
            </Link>
          ))}

          {/* Learn dropdown */}
          <div className="site-navbar__dropdown">
            <button
              onClick={() => setLearnOpen(o => !o)}
              className={`site-navbar__dropdown-toggle${isLearnActive ? " is-active" : ""}`}
              aria-expanded={learnOpen}
            >
              Learn
              <span className={`site-navbar__chevron${learnOpen ? " is-open" : ""}`}>▼</span>
            </button>

            {learnOpen && (
              <div className="site-navbar__dropdown-menu">
                {LEARN_LINKS.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setLearnOpen(false)}
                    className={`site-navbar__dropdown-item${location.pathname === to ? " is-active" : ""}`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* GitHub */}
          <a href={GH} target="_blank" rel="noopener noreferrer" className="site-navbar__youtube">
            Intro
          </a>
        </div>

        {/* Hamburger (mobile) */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className={`site-navbar__hamburger${menuOpen ? " is-open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="site-navbar__hamburger-line site-navbar__hamburger-line--top" />
          <span className="site-navbar__hamburger-line site-navbar__hamburger-line--middle" />
          <span className="site-navbar__hamburger-line site-navbar__hamburger-line--bottom" />
        </button>

        {/* Mobile menu drawer with Scrolling Fixed */}
        {menuOpen && (
          <div className="site-navbar__mobile-menu">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMenus}
                className={`site-navbar__mobile-link${isActive(to) ? " is-active" : ""}`}
              >
                {label}
              </Link>
            ))}

            {/* Learn section on mobile */}
            <button
              onClick={() => setLearnOpen(o => !o)}
              className={`site-navbar__mobile-learn-toggle${isLearnActive ? " is-active" : ""}`}
              aria-expanded={learnOpen}
            >
              <span>Learn</span>
              <span className={`site-navbar__chevron${learnOpen ? " is-open" : ""}`}>▼</span>
            </button>

            {learnOpen && (
              <div className="site-navbar__mobile-learn-links">
                {LEARN_LINKS.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={closeMenus}
                    className={`site-navbar__mobile-learn-link${location.pathname === to ? " is-active" : ""}`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}

            <a
              href={GH}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenus}
              className="site-navbar__mobile-github"
            >
              GitHub ↗
            </a>
          </div>
        )}
      </nav>

      {/* Body offset so content isn't hidden under fixed nav */}
      <div className="site-navbar__spacer" aria-hidden="true" />
    </>
  );
}