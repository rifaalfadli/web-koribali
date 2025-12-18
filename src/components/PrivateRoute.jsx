import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const userCookie = Cookies.get("user");

  // kalau belum login, arahkan ke /login
  if (!userCookie) {
    return <Navigate to="/entry" replace />;
  }

  try {
    const parsedUser = JSON.parse(userCookie);
    const userId = parsedUser?.id;

    // nanti kamu bisa tambah validasi fetch ke server di sini
    if (!userId) {
      Cookies.remove("user");
      return <Navigate to="/login" replace />;
    }

    // kalau lolos validasi, tampilkan halamannya
    return children;
  } catch (err) {
    console.error("Auth error:", err);
    Cookies.remove("user");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

// import { Navigate } from "react-router-dom";
// import Cookies from "js-cookie";

// const ProtectedRoute = ({ children }) => {
//   const userCookie = Cookies.get("user");

//   // Belum login sama sekali => Entry page
//   if (!userCookie) {
//     return <Navigate to="/entry" replace />;
//   }

//   try {
//     const parsedUser = JSON.parse(userCookie);
//     const { id, role } = parsedUser;

//     // Cookie ada tapi tidak valid => Login
//     if (!id || !role) {
//       Cookies.remove("user");
//       return <Navigate to="/login" replace />;
//     }

//     // Guest & Member boleh masuk
//     return children;
//   } catch (err) {
//     console.error("Auth error:", err);
//     Cookies.remove("user");
//     return <Navigate to="/login" replace />;
//   }
// };

// export default ProtectedRoute;

/*


import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function PrivateRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      const userId = parsedUser?.id;

      // Validasi ke server dummy
      fetch("http://localhost:5000/anggota")
        .then((res) => res.json())
        .then((data) => {
          const validUser = data.anggota.find((u) => u.id === userId);
          setIsAuthenticated(!!validUser);
        })
        .catch(() => setIsAuthenticated(false))
        .finally(() => setLoading(false));
    } catch {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateRoute;



*/
