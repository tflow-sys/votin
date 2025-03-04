import { useParams, useNavigate } from "react-router-dom";
import { useElection } from "@/contexts/ElectionContext";
import DashboardHeader from "@/components/DashboardHeader";
import ElectionHeader from "@/components/ElectionHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Users2Icon, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

const ElectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getElection } = useElection();
  const navigate = useNavigate();

  const election = getElection(id || "");

  if (!election) {
    navigate("/dashboard");
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <ElectionHeader election={election} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Election Details</CardTitle>
                <CardDescription>
                  Information about this upcoming election
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="font-medium mr-2">Start Date:</span>
                    {format(new Date(election.startDate), "PPP p")}
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="font-medium mr-2">End Date:</span>
                    {format(new Date(election.endDate), "PPP p")}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users2Icon className="mr-2 h-4 w-4" />
                    <span className="font-medium mr-2">Positions:</span>
                    {election.positions.length} position
                    {election.positions.length !== 1 ? "s" : ""}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/50 rounded-md border border-yellow-200 dark:border-yellow-900 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-400">
                      Not Yet Active
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-500">
                      This election has not started yet. You will be able to
                      vote once it begins on{" "}
                      {format(new Date(election.startDate), "PPP")}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue={election.positions[0].id} className="mb-8">
              <TabsList className="grid grid-cols-2 w-full">
                {election.positions.map((position) => (
                  <TabsTrigger key={position.id} value={position.id}>
                    {position.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {election.positions.map((position) => (
                <TabsContent
                  key={position.id}
                  value={position.id}
                  className="mt-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>{position.title}</CardTitle>
                      <CardDescription>{position.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {position.candidates.map((candidate) => (
                          <Card key={candidate.id}>
                            <CardContent className="pt-6">
                              <div className="flex items-center space-x-4 mb-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage
                                    src={candidate.imageUrl}
                                    alt={candidate.name}
                                  />
                                  <AvatarFallback>
                                    {getInitials(candidate.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">
                                    {candidate.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {candidate.position}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm">{candidate.manifesto}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Voting Information</CardTitle>
                <CardDescription>How to vote in this election</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Voting Methods</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {election.positions.map((position) => (
                        <li key={position.id}>
                          <span className="font-medium">{position.title}:</span>{" "}
                          {position.isRanked
                            ? `Ranked choice (select up to ${position.maxSelections} in order of preference)`
                            : position.maxSelections > 1
                            ? `Multiple choice (select up to ${position.maxSelections})`
                            : "Single choice"}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Important Notes</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>You must vote during the election period</li>
                      <li>Once submitted, votes cannot be changed</li>
                      <li>You can only vote once for each position</li>
                      <li>Results will be published after verification</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ElectionDetails;
