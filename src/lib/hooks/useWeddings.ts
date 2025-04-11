import { useState, useEffect } from "react";
import { Wedding } from "@/types/wedding";

export function useWeddings() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        const response = await fetch("/api/wedding");
        if (!response.ok) {
          throw new Error("Failed to fetch weddings");
        }
        const data = await response.json();
        setWeddings(data);
      } catch (error) {
        console.error("Error fetching weddings:", error);
        setError("Failed to load weddings");
      } finally {
        setLoading(false);
      }
    };

    fetchWeddings();
  }, []);

  return { weddings, loading, error };
}
