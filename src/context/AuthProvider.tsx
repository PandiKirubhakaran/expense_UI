import  { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  user: any;
  isAuthenticated: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const login = (userData: any, ) => {
    console.log(userData,'login')
    localStorage.setItem("authToken", JSON.stringify(userData.token)); // Store token in localStorage
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("authToken"); // Clear token from localStorage
    setUser(null);
  };

  const isAuthenticated = !!localStorage.getItem("authToken"); // Check if token exists

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
