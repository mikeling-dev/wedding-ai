import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { setAuth, clearAuth } from "../store/authSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      const tokenFromCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (tokenFromCookie) {
        try {
          const response = await fetch("/api/auth/me", {
            credentials: "include",
          });
          if (response.ok) {
            const { user: userData } = await response.json();
            dispatch(setAuth({ user: userData, token: tokenFromCookie }));
          } else {
            dispatch(clearAuth());
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          dispatch(clearAuth());
        }
      } else {
        dispatch(clearAuth());
      }
    };

    checkAuth();
    // router.events.on("routeChangeComplete", checkAuth);
    // return () => router.events.off("routeChangeComplete", checkAuth);
  }, [dispatch]);

  const login = () => {
    router.push("/api/auth/google");
  };

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    dispatch(clearAuth());
    router.push("/");
  };

  return { user, token, login, logout };
}
