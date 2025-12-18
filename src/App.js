import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Beranda from "./pages/Beranda";
import ProtectedRoute from "./components/PrivateRoute";
import Kontak from "./pages/Kontak";
import Galeri from "./pages/Galeri";
import StrukturPegawai from "./pages/StrukturPegawai";
import ProfilePage from "./pages/Profile";
import Proyek from "./pages/Proyek";
import Calculation from "./calculation/pages/Calculation";
import Report from "./calculation/pages/Report";
import NotFoundPage from "./pages/404";
import LayoutProtected from "./components/LayoutProtected";
import ScrollToTop from "./components/shared/ScroolTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <LayoutProtected />
            </ProtectedRoute>
          }
        >
          <Route index element={<Beranda />} />
          <Route path="struktur" element={<StrukturPegawai />} />
          <Route path="proyek" element={<Proyek />} />
          <Route path="galeri" element={<Galeri />} />
          <Route path="kontak" element={<Kontak />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="calculation" element={<Calculation />} />
          <Route path="report" element={<Report />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
