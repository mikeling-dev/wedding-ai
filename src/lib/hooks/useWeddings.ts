import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  setWeddings,
  setWeddingLoading,
  setWeddingError,
} from "@/store/slices/weddingSlice";

export function useWeddings() {
  const dispatch = useDispatch();
  const { weddings, loading, error } = useSelector(
    (state: RootState) => state.wedding
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const fetchWeddings = async () => {
    if (!isAuthenticated) {
      dispatch(setWeddings([]));
      return;
    }

    dispatch(setWeddingLoading(true));
    try {
      const response = await fetch("/api/wedding");
      if (!response.ok) {
        throw new Error("Failed to fetch weddings");
      }
      const data = await response.json();
      dispatch(setWeddings(data));
    } catch (error) {
      console.error("Error fetching weddings:", error);
      dispatch(
        setWeddingError(
          error instanceof Error ? error.message : "Failed to load weddings"
        )
      );
    }
  };

  useEffect(() => {
    fetchWeddings();
  }, [isAuthenticated, dispatch]);

  return { weddings, loading, error, refetch: fetchWeddings };
}
