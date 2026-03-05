import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/shared/Transition";
import Header from "../components/Header";
import MainHero from "../components/MainHero";
import GaleriSection from "../components/GaleriSection";
import Footer from "../components/Footer";
import "../assets/styles/Style.css";
import "../assets/styles/Responsive.css";

export default function Beranda() {
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const shouldShow = sessionStorage.getItem("showTransition");
    if (shouldShow === "true") {
      setShowTransition(true);
      sessionStorage.removeItem("showTransition");
      const timer = setTimeout(() => setShowTransition(false), 1200);
      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <>
      {/* Tampilkan animasi di atas semua */}
      {showTransition &&
        typeof document !== "undefined" &&
        createPortal(<PageTransition />, document.body)}
      <Header />
      <div className="page-wrapper">
        <Helmet>
          <title>CV. KORI BALI</title>
          <meta
            name="description"
            content="CV. KORI BALI adalah perusahaan konstruksi dan perhitungan pole berpengalaman internasional."
          />
        </Helmet>

        <MainHero />
        <main>
          {/* Tentang */}
          <section id="tentang" className="main-tentang">
            <div className="main-tentang-container">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                Tentang Kami
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
              >
                <strong>CV. KORI BALI</strong> adalah kantor cabang dan pusat
                pendukung dari perusahaan utama di Jepang, Yoshimoto Pole. Sejak
                berdiri, kami terlibat dalam berbagai proyek teknik dan struktur
                sesuai kebutuhan mitra di Jepang.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
              >
                Layanan kami mencakup kalkulasi beban tetap, angin, dan gempa,
                serta perhitungan kabel, tiang, arm, dan area struktur. Hasil
                analisis disajikan dalam laporan teknis lengkap beserta gambar
                2D <i>(AutoCAD)</i> dan 3D <i>(Autodesk Inventor)</i>. Untuk
                efisiensi, kami juga membangun sistem kalkulasi berbasis{" "}
                <abbr title="Visual Basic for Applications">VBA</abbr> di{" "}
                <i>Excel</i> agar lebih cepat dan akurat.
              </motion.p>
            </div>
          </section>

          {/* Layanan */}
          <section id="layanan" className="main-layanan">
            <div className="container">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                Layanan Utama
              </motion.h2>
              {[
                {
                  title: "Kalkulasi Teknis",
                  desc: "Kalkulasi struktur tiang dan beban secara presisi.",
                },
                {
                  title: "Pemodelan Gambar",
                  desc: "Pemodelan 2D (AutoCAD) & 3D (Inventor) yang detail.",
                },
                {
                  title: "Sistem VBA Excel",
                  desc: "Automasi sistem kalkulasi dengan VBA berbasis Excel.",
                },
                {
                  title: "Laporan Teknik",
                  desc: "Laporan profesional lengkap dengan visualisasi hasil.",
                },
                {
                  title: "Rendering 3D",
                  desc: "Visualisasi 3D realistis untuk gambaran proyek.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="daftar-layanan"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Proyek */}
          <section id="proyek" className="main-proyek">
            <div className="container">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                Proyek Unggulan
              </motion.h2>
              <div className="main-proyek-container">
                {[
                  {
                    to: "/proyek/proyek-3D",
                    img: "/images/gambar6.jpg",
                    title: "Pemodelan 3D",
                    desc: "Pemodelan struktur tiang dan sambungan menggunakan software 3D untuk kebutuhan visualisasi dan fabrikasi.",
                  },
                  {
                    to: "/proyek/proyek-2D",
                    img: "/images/gambar2.jpg",
                    title: "Pemodelan 2D",
                    desc: "Pembuatan gambar teknik detail seperti potongan, tampak, dan denah sebagai acuan produksi.",
                  },
                  {
                    to: "/proyek/proyek-VBA",
                    img: "/images/gambar25.PNG",
                    title: "Sistem Kalkulasi VBA",
                    desc: "Sistem otomatisasi perhitungan teknis berbasis Excel VBA untuk validasi kekuatan dan efisiensi.",
                  },
                  {
                    to: "/proyek/proyek-rendering",
                    img: "/images/gambar9.jpg",
                    title: "Rendering",
                    desc: "Visualisasi akhir proyek dalam bentuk render 3D untuk presentasi dan dokumentasi klien.",
                  },
                ].map((item, i) => (
                  <motion.article
                    key={i}
                    className="card-proyek"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <Link to={item.to}>
                      <div className="image-frame">
                        <img src={item.img} alt={item.title} width="300" />
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </Link>
                  </motion.article>
                ))}
              </div>
              <div className="position-btn-proyek">
                <Link to="/proyek" className="btn">
                  Lihat Proyek Lainnya
                </Link>
              </div>
            </div>
          </section>

          {/* Galeri */}
          <GaleriSection />

          {/* Kontak */}
          <section id="kontak" className="main-kontak">
            <div className="main-kontak-container">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                Jangan ragu untuk menghubungi Kami
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                Jika Anda membutuhkan dukungan teknis atau ingin menjalin kerja
                sama, kami siap membantu Anda dengan solusi terbaik.
              </motion.p>
              <Link to="/kontak" className="btn">
                Hubungi Kami
              </Link>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
