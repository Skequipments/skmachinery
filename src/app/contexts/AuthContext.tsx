
"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("adminUser");
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    const validUsers = [
      { username: "admin", password: "admin123" },
    ];

    const isValid = validUsers.some(
      (user) => user.username === username && user.password === password
    );

    if (isValid) {
      setUser(username);
      localStorage.setItem("adminUser", username);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
