import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import Hero from "../components/Hero";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/styles/Style.css";
import "../assets/styles/Responsive.css";
import { useAllUsers } from "../hooks/useAllUsers";

function DivisiTable({ id, title, data }) {
  return (
    <section id={id} className="container container-struktur">
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {title}
      </motion.h2>

      <motion.table
        id={`data-divisi-${id}`}
        className="table-pegawai"
        border={1}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>No</th>
            <th>Nama</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((user, index) => (
              <tr key={user.id}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td>{user.profile?.full_name}</td>
                <td>{user.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", color: "gray" }}>
                Belum ada anggota di divisi ini.
              </td>
            </tr>
          )}
        </tbody>
      </motion.table>
    </section>
  );
}

export default function StrukturPegawai() {
  // const [anggota, setAnggota] = useState([]);
  // const [loading, setLoading] = useState(true);

  // Fetch data anggota dari server
  // useEffect(() => {
  //   const fetchAnggota = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5000/anggota");
  //       if (!res.ok) throw new Error("Gagal ambil data anggota");

  //       const data = await res.json();
  //       // Pastikan data aman
  //       const safeData = data.map(({ fullname, email, divisi }) => ({
  //         fullname,
  //         email,
  //         divisi: divisi ?? "Tidak ada divisi",
  //       }));

  //       setAnggota(safeData);
  //     } catch (err) {
  //       console.error("Fetch error::", err);
  //       setAnggota([]); // fallback
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAnggota();
  // }, []);

  const { users, loading, refreshUser } = useAllUsers();

  // Kelompokkan berdasarkan divisi
  const ys = users.filter((a) => a.employee_detail?.division == "ys") || [];
  const yp = users?.filter((a) => a.employee_detail?.division == "yp") || [];
  const dev = users.filter((a) => a.employee_detail?.division == "dev") || [];
  console.log("ini user:", yp);

  if (loading) return <div className="profile-Loading">Loading data...</div>;

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <Helmet>
          <title>Our Team - CV. KORI BALI</title>
          <meta
            name="description"
            content="Halaman struktur pegawai CV. KORI BALI yang menampilkan susunan tim setiap divisi."
          />
        </Helmet>

        <Hero title="Our Team" />
        <Breadcrumb page="Our Team" />

        <main>
          <DivisiTable id="ys" title="Divisi YS" data={ys} />
          <DivisiTable id="yp" title="Divisi YP" data={yp} />
          <DivisiTable id="development" title="Divisi Development" data={dev} />
        </main>
      </div>
      <Footer />
    </>
  );
}
