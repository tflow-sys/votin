import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { School } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

const Login = () => {
  const [studentNumber, setStudentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentNumber || !email || !phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(studentNumber, email, phoneNumber);

      if (success) {
        toast({
          title: "Authentication code sent",
          description:
            "Please check your email and phone for the verification code",
        });
        navigate("/verify");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            {/* <School className="h-8 w-8 mr-2 text-primary" /> */}
            <h1 className="text-xl font-bold">Nkumba University E-Voting</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Column - Banner */}
        <div className="md:w-1/2 bg-primary p-8 flex flex-col justify-center items-center text-primary-foreground">
          {/* <School className="h-20 w-20 mb-6" /> */}
          <h1 className="text-3xl font-bold mb-4 text-center">
            Welcome to Nkumba University E-Voting System
          </h1>
          <p className="text-lg mb-6 text-center max-w-md">
            Your secure platform for participating in university elections.
            Login with your student credentials to get started.
          </p>
          <div className="bg-primary-foreground/10 p-6 rounded-lg max-w-md">
            <h3 className="font-semibold mb-2">Login Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Enter your student number</li>
              <li>Use your university email address</li>
              <li>Provide your phone number to receive verification code</li>
              <li>Submit the form to proceed to verification</li>
            </ol>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="md:w-1/2 p-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Student Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the voting system
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentNumber">Student Number</Label>
                  <Input
                    id="studentNumber"
                    placeholder="e.g., 2023/BSC/001"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">University Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., student@nkumba.ac.ug"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="e.g., +256 700 000 000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
