import { useEffect, useState } from "react";
import { fetchNotifications } from "../api/notifications";

export function useNotifications(page, filter) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const data = await fetchNotifications(page, 10, filter);

        setNotifications(
          data.notifications || []
        );

        setTotalPages(data.totalPages || 1);

        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, filter]);

  return {
    notifications,
    loading,
    error,
    totalPages,
  };
}