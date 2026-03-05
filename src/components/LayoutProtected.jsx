import { Outlet } from "react-router-dom";

const LayoutProtected = () => {
  return (
    <div className="layoutprivate">
      {/* Semua halaman private (yang di dalam ProtectedRoute) */}
      <Outlet />
    </div>
  );
};

export default LayoutProtected;
