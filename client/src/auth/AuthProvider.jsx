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

  const token = localStorage.getItem("token"); // <-- adiciona isso

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
      await apiFetch("/auth/logout/", { method: "POST" });
    } catch (e) {
      // ignorando o erro de logout, mas variável usada
      console.error("Erro ao fazer logout:", e);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}