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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

const VerifyToken = () => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const { student, verifyToken } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!student) {
    navigate("/");
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // For demo purposes, the code is hardcoded to 123456
      const success = await verifyToken(token);

      if (success) {
        setVerificationStatus("success");
        toast({
          title: "Verification successful",
          description: "You will be redirected to the instructions page",
        });

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/instructions");
        }, 2000);
      } else {
        setVerificationStatus("error");
        toast({
          title: "Verification failed",
          description: "Invalid code. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      setVerificationStatus("error");
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
        {/* Left Column - Status */}
        <div className="md:w-1/2 bg-primary p-8 flex flex-col justify-center items-center text-primary-foreground">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Verification Required</h1>
            <p className="text-lg max-w-md">
              We've sent a verification code to your email and phone number.
              Please enter the code to continue.
            </p>
          </div>

          {verificationStatus === "success" && (
            <div className="bg-green-500/20 p-6 rounded-lg max-w-md flex items-center">
              <CheckCircle className="h-12 w-12 mr-4 text-green-300" />
              <div>
                <h3 className="font-semibold text-xl mb-1">
                  Verification Successful
                </h3>
                <p>You will be redirected to the instructions page.</p>
              </div>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="bg-red-500/20 p-6 rounded-lg max-w-md flex items-center">
              <XCircle className="h-12 w-12 mr-4 text-red-300" />
              <div>
                <h3 className="font-semibold text-xl mb-1">
                  Verification Failed
                </h3>
                <p>The code you entered is incorrect. Please try again.</p>
              </div>
            </div>
          )}

          {verificationStatus === "idle" && (
            <div className="bg-primary-foreground/10 p-6 rounded-lg max-w-md">
              <h3 className="font-semibold mb-2">Verification Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Check your email and phone for the verification code</li>
                <li>Enter the 6-digit code in the field</li>
                <li>Submit to verify your identity</li>
                <li>You will be redirected to the instructions page</li>
              </ol>
              <p className="mt-4 text-sm">
                <strong>Note:</strong> For this demo, use code{" "}
                <strong>123456</strong>
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Verification Form */}
        <div className="md:w-1/2 p-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Verify Your Identity</CardTitle>
              <CardDescription>
                Enter the verification code sent to your email and phone
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{student.name}</h3>
                  <p className="text-muted-foreground">
                    {student.studentNumber}
                  </p>
                  <p className="text-muted-foreground">{student.program}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="token">Verification Code</Label>
                    <Input
                      id="token"
                      placeholder="Enter 6-digit code"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex-col items-start">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive a code? Check your spam folder or try again.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate("/")}
              >
                Return to login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerifyToken;
