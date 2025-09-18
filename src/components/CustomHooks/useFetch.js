import { useState, useEffect } from "react";

const useFetch = (url, interval = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    let pollingId;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (interval) {
      pollingId = setInterval(() => {
        console.log("⏱️ Polling data...");
        fetchData();
      }, interval);
    }

    return () => {
      if (pollingId) clearInterval(pollingId);
    };
  }, [url, interval]);

  return { data, loading, error };
};

export default useFetch;
