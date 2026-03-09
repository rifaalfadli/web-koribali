import { useEffect, useState } from "react";
import { fetchAPI } from "../utils/api";

export const useMessage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAllMessage = async () => {
    try {
      setLoading(true);
      const response = await fetchAPI("/message");

      if (!response.ok) throw new Error("gagal mengambil daftar message");

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMessage();
  }, []);
};
