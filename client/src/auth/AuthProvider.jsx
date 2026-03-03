import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch } from "../api/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  function login(data) {
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }

    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    }
  }

  async function logout() {
    try {
      await apiFetch("/auth/logout/", {
        method: "POST",
      });
    } catch {
      // Mesmo se der erro no backend, limpa localmente
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}