import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function PrivateRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
    // const user = Cookies.get("user");
    const token = Cookies.get('access_token')

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Hit API
    try{
    const res = await fetch('http://localhost:5000/auth/verify', {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, 
        // "Authorization": `Bearer tokenasal`, 
        "Content-Type": "application/json"
      }
    })

    if(!res.ok){
      throw new Error('Token tidak valid')
    }

    const data = await res.json()
    // console.log('user verif: ', data)

    setIsAuthenticated(true)
  } catch (error) {
    console.error('auth error', error.message)
    Cookies.remove('access_token')
    setIsAuthenticated(false)
  } finally{
    setLoading(false)
  }

}
verifyToken()

    // try {
    //   const parsedUser = JSON.parse(user);
    //   const userId = parsedUser?.id;

    //   fetch("http://localhost:5000/anggota")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       const validUser = data.find((u) => String(u.id) === String(userId));
    //       setIsAuthenticated(!!validUser);
    //     })
    //     .catch(() => setIsAuthenticated(false))
    //     .finally(() => setLoading(false));
    // } catch {
    //   setIsAuthenticated(false);
    //   setLoading(false);
    // }
  }, []);

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
