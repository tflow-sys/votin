import { createContext, useContext, useState, ReactNode } from "react";

interface Student {
  id: string;
  studentNumber: string;
  email: string;
  phoneNumber: string;
  name: string;
  program: string;
  avatar: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  student: Student | null;
  login: (
    studentNumber: string,
    email: string,
    phoneNumber: string
  ) => Promise<boolean>;
  verifyToken: (token: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [student, setStudent] = useState<Student | null>(null);

  // Mock login function - in a real app, this would call an API
  const login = async (
    studentNumber: string,
    email: string,
    phoneNumber: string
  ): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock student data - in a real app, this would come from the backend
      const mockStudent: Student = {
        id: "123456",
        studentNumber,
        email,
        phoneNumber,
        name: "Tashah Desire",
        program: "Bachelor of Science in Computer Science",
        avatar:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100539",
      };

      setStudent(mockStudent);
      // Don't set authenticated yet, wait for token verification
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Mock token verification function
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, validate the token with the backend
      if (token === "123456") {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setStudent(null);
  };

  const value = {
    isAuthenticated,
    student,
    login,
    verifyToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
