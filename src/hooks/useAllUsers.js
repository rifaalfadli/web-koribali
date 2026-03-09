import { useEffect, useState } from "react";
import { fetchAPI } from "../utils/api";

export const useAllUsers = () => {
  const [users, setuUers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchAPI("/user");
      console.log("ini di hooks", users);

      if (!response.ok) throw new Error("gagal mengambil daftar user");

      const data = await response.json();
      setuUers(data);
    } catch (err) {
      setError(err.message);
      setuUers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return { users, loading, error, refreshUsers: getAllUsers };
};
