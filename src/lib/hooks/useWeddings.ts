import { useEffect, useRef, useCallback } from "react";
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
  const initialFetchDone = useRef(false);

  const fetchWeddings = useCallback(async () => {
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
      dispatch(setWeddingLoading(false));
    } catch (error) {
      console.error("Error fetching weddings:", error);
      dispatch(
        setWeddingError(
          error instanceof Error ? error.message : "Failed to load weddings"
        )
      );
      dispatch(setWeddingLoading(false));
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!initialFetchDone.current && isAuthenticated) {
      fetchWeddings();
      initialFetchDone.current = true;
    }
  }, [isAuthenticated, fetchWeddings]);

  return { weddings, loading, error, mutate: fetchWeddings };
}
