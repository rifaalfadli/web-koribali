import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { Menu, X } from "lucide-react";
import "../assets/styles/Style.css";
import "../assets/styles/Responsive.css";

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update otomatis kalau layar di-resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 960);
    handleResize(); // cek awal setelah komponen ter-mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  // ================================
  //  Tampilan Dekstop
  // ================================
  const DesktopHeader = () => (
    <header className="header">
      {openDropdown && (
        <div
          className="dropdown-overlay"
          onClick={() => setOpenDropdown(false)}
        />
      )}

      <nav className="navbar">
        {/* <input type="checkbox" id="menu" /> */}
        <div className="navbar-logo">
          <div className="logo">
            <Link to="/">
              <img
                src="/images/logo-koribali.png"
                alt="logo koribali"
                width="100px"
                className="logo-koribali"
              />
            </Link>
            <div className="navbar-title">
              <Link to="/">
                <h1>
                  KORI<span>BALI</span>
                </h1>
              </Link>
            </div>
          </div>
        </div>

        <div className="navbar-area">
          <div className="navbar-menu">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/struktur">Our Team</Link>
              </li>
              <li>
                <Link to="/proyek">Project</Link>
              </li>
              <li>
                <Link to="/galeri">Gallery</Link>
              </li>
              <li>
                <Link to="/kontak">Contact</Link>
              </li>
            </ul>
          </div>
          <ProfileMenu />
        </div>
      </nav>
    </header>
  );

  // ================================
  //  Tampilan Mobile
  // ================================
  const MobileHeader = () => (
    <header className="header">
      <nav className="navbar">
        {/* <input type="checkbox" id="menu" /> */}
        <div className="navbar-logo">
          <div className="logo">
            <Link to="/">
              <img
                src="/images/logo-koribali.png"
                alt="logo koribali"
                width="100px"
                className="logo-koribali"
              />
            </Link>
            <div className="navbar-title">
              <Link to="/">
                <h1>
                  KORI<span>BALI</span>
                </h1>
              </Link>
            </div>
          </div>

          <div className="navbar-area">
            <div className="icon-navbar">
              <button
                className="icon-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>

            <ProfileMenu />
          </div>
        </div>

        <div className={`navbar-menu ${mobileMenuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/struktur">Our Team</Link>
            </li>
            <li>
              <Link to="/proyek">Project</Link>
            </li>
            <li>
              <Link to="/galeri">Gallery</Link>
            </li>
            <li>
              <Link to="/kontak">Contact</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );

  // Render salah satu tergantung ukuran layar
  return isMobile ? <MobileHeader /> : <DesktopHeader />;
}
