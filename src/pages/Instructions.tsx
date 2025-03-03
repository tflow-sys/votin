import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, AlertTriangle, ShieldCheck, Vote } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Instructions = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { student } = useAuth();
  const navigate = useNavigate();

  if (!student) {
    navigate("/");
    return null;
  }

  const handleContinue = () => {
    navigate("/dashboard");
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

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Election Instructions & Guidelines
          </h1>

          <div className="grid gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <Vote className="h-8 w-8 mr-4 text-primary flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Voting Process
                    </h2>
                    <p className="mb-4">
                      The Nkumba University E-Voting System allows you to
                      participate in various elections. Here's how the process
                      works:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>
                        Navigate to the dashboard to view all available
                        elections
                      </li>
                      <li>Select an ongoing election to participate in</li>
                      <li>Review the positions and candidates carefully</li>
                      <li>
                        Cast your vote for each position according to the voting
                        method
                      </li>
                      <li>Confirm your selections before final submission</li>
                      <li>Receive confirmation of your successful vote</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <CheckCircle className="h-8 w-8 mr-4 text-primary flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Voting Methods
                    </h2>
                    <p className="mb-4">
                      Depending on the election, you may encounter different
                      voting methods:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        <strong>Single Choice:</strong> Select only one
                        candidate for a position
                      </li>
                      <li>
                        <strong>Multiple Choice:</strong> Select multiple
                        candidates up to a specified limit
                      </li>
                      <li>
                        <strong>Ranked Choice:</strong> Rank candidates in order
                        of preference
                      </li>
                    </ul>
                    <p className="mt-4">
                      The system will clearly indicate which method applies to
                      each position.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <ShieldCheck className="h-8 w-8 mr-4 text-primary flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Security & Privacy
                    </h2>
                    <p className="mb-4">
                      We take the security and privacy of your vote seriously:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>
                        Your vote is anonymous and cannot be traced back to you
                      </li>
                      <li>
                        The system uses encryption to protect your voting data
                      </li>
                      <li>
                        Multi-factor authentication ensures only eligible
                        students can vote
                      </li>
                      <li>
                        You can only vote once for each position in an election
                      </li>
                      <li>
                        The system prevents tampering with votes after
                        submission
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-8 w-8 mr-4 text-primary flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Important Notes
                    </h2>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Once submitted, your vote cannot be changed</li>
                      <li>
                        Elections have strict deadlines - votes cannot be cast
                        after the closing time
                      </li>
                      <li>
                        If you encounter technical issues, contact the Electoral
                        Commission immediately
                      </li>
                      <li>
                        Attempting to manipulate the voting system is a
                        violation of university policy
                      </li>
                      <li>
                        Results will be published after verification by the
                        Electoral Commission
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-start space-x-2 mb-6">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) =>
                  setAcceptedTerms(checked as boolean)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read and understood the election instructions and
                guidelines. I agree to abide by the university election policy
                and understand that any violation may result in disciplinary
                action.
              </label>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleContinue} disabled={!acceptedTerms}>
                Continue to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
