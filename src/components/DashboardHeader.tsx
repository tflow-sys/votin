import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          {/* <School className="h-8 w-8 mr-2 text-primary" /> */}
          <h1 className="text-xl font-bold">Nkumba University E-Voting</h1>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {student && (
            <>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden md:inline">
                  {student.name}
                </span>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
