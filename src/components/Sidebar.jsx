import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Box, Calculator, Image, ChevronRight } from "lucide-react";
import "../assets/styles/Style.css";
import "../assets/styles/Responsive.css";

export function Sidebar() {
  const [activeSection, setActiveSection] = useState("rendering");

  // Gunakan useMemo agar projectLinks tidak berubah di setiap render
  const projectLinks = useMemo(
    () => [
      {
        id: "rendering",
        name: "Rendering Proyek",
        icon: Image,
        color: "#3b82f6",
      },
      { id: "pemodelan-3d", name: "Pemodelan 3D", icon: Box, color: "#a855f7" },
      {
        id: "gambar-2d",
        name: "Gambar Teknik 2D",
        icon: FileText,
        color: "#22c55e",
      },
      { id: "vba", name: "Kalkulasi VBA", icon: Calculator, color: "#f97316" },
    ],
    [],
  );

  useEffect(() => {
    const handleScroll = () => {
      const sections = projectLinks.map((link) => link.id);
      const current = sections.find((id) => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [projectLinks]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="sidebar-box"
        >
          <h4 className="sidebar-title">Kategori Proyek</h4>
          <nav>
            <ul className="sidebar-list">
              {projectLinks.map((link) => {
                const isActive = activeSection === link.id;
                const Icon = link.icon;
                return (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className={`sidebar-btn ${isActive ? "active" : ""}`}
                    >
                      <Icon
                        className="sidebar-icon"
                        style={{ color: isActive ? "#fff" : link.color }}
                      />
                      <span className="sidebar-text">{link.name}</span>
                      <ChevronRight
                        className={`sidebar-arrow ${isActive ? "visible" : ""}`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="sidebar-progress">
            <div className="progress-header">
              <span>Progress</span>
              <span>
                {projectLinks.findIndex((l) => l.id === activeSection) + 1}/
                {projectLinks.length}
              </span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: "25%" }}
                animate={{
                  width: `${
                    ((projectLinks.findIndex((l) => l.id === activeSection) +
                      1) /
                      projectLinks.length) *
                    100
                  }%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}
