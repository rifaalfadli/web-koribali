import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function PrivateRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = Cookies.get("user");

    if (!user) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      const userId = parsedUser?.id;

      fetch("http://localhost:5000/anggota")
        .then((res) => res.json())
        .then((data) => {
          const validUser = data.find((u) => String(u.id) === String(userId));
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
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
