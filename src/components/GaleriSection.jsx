import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../assets/styles/Style.css";
import "../assets/styles/Responsive.css";

export default function GaleriSection() {
  const galeriRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const images = [14, 15, 16, 17, 18, 19, 21, 22];

  const scrollLeft = () => {
    galeriRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    galeriRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    const container = galeriRef.current;

    const handleScroll = () => {
      const scrollPos = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const index = Math.round((scrollPos / maxScroll) * (images.length - 1));
      setScrollIndex(index);
      setActiveIndex(index); // sync dot aktif juga
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [images.length]);

  const isAtStart = scrollIndex === 0;
  const isAtEnd = scrollIndex === images.length - 1;

  return (
    <section id="galeri-preview" className="main-galeri">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          Galeri Preview
        </motion.h2>

        {/* Tombol kiri & kanan */}
        <button
          className={`scroll-btn left ${isAtStart ? "disabled" : ""}`}
          onClick={scrollLeft}
          disabled={isAtStart}
        >
          <ChevronLeft size={28} />
        </button>
        <button
          className={`scroll-btn right ${isAtEnd ? "disabled" : ""}`}
          onClick={scrollRight}
          disabled={isAtEnd}
        >
          <ChevronRight size={28} />
        </button>

        {/* Galeri */}
        <div className="main-galeri-container" ref={galeriRef}>
          {images.map((num, index) => (
            <motion.figure
              key={num}
              className={`galeri-card ${activeIndex === index ? "active" : ""}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.1 }}
            >
              <img
                src={`/images/gambar${num}.PNG`}
                alt="Model Tiang Lampu Jalan"
              />
              <figcaption>Model Tiang Lampu Jalan</figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Bulat indikator */}
        <motion.div
          className="indicator-dots"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === activeIndex ? "active" : ""}`}
              onClick={() => {
                const container = galeriRef.current;
                const scrollAmount =
                  (container.scrollWidth - container.clientWidth) *
                  (index / (images.length - 1));
                container.scrollTo({ left: scrollAmount, behavior: "smooth" });
                setActiveIndex(index);
              }}
            ></span>
          ))}
        </motion.div>

        {/* Tombol lihat selengkapnya */}
        <motion.div
          className="position-btn-galeri"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.4 }}
        >
          <Link to="/galeri" className="btn">
            Lihat Selengkapnya
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
