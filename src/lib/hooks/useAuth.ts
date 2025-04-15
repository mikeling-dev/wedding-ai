import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setToken, clearAuth } from "../../store/slices/authSlice";
import { setUser, clearUser } from "../../store/slices/userSlice";
import { setPartner, clearPartner } from "../../store/slices/partnerSlice";
import { clearWeddings } from "../../store/slices/weddingSlice";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const initialAuthCheckDone = useRef(false);

  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.user.profile);
  const partner = useSelector((state: RootState) => state.partner.partner);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip if we've already done the initial auth check or if we already have a user
      if (initialAuthCheckDone.current || user) return;

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
            dispatch(setToken(tokenFromCookie));
            dispatch(setUser(userData));

            // If user has a partnerId, fetch partner information
            if (userData.partnerId) {
              const partnerResponse = await fetch("/api/partner", {
                credentials: "include",
              });
              if (partnerResponse.ok) {
                const partnerData = await partnerResponse.json();
                dispatch(setPartner(partnerData));
              }
            }
          } else {
            clearAllState();
          }
        } catch {
          clearAllState();
        }
      } else {
        clearAllState();
      }

      initialAuthCheckDone.current = true;
    };

    checkAuth();
  }, [dispatch, user]);

  const clearAllState = () => {
    dispatch(clearAuth());
    dispatch(clearUser());
    dispatch(clearPartner());
    dispatch(clearWeddings());
  };

  const login = () => {
    window.location.href = "/api/auth/google";
  };

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/";
    clearAllState();
    router.push("/");
  };

  return { user, token, partner, isAuthenticated, login, logout };
}
