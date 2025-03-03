import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useElection, Position } from "@/contexts/ElectionContext";
import DashboardHeader from "@/components/DashboardHeader";
import ElectionHeader from "@/components/ElectionHeader";
import CountdownTimer from "@/components/ui/countdown-timer";
import CandidateCard from "@/components/CandidateCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertTriangle } from "lucide-react";

const OngoingElection = () => {
  const { id } = useParams<{ id: string }>();
  const { getElection, submitVote, hasVoted } = useElection();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Move all useState declarations to the top
  const [activePosition, setActivePosition] = useState<string>("");
  const [selectedCandidates, setSelectedCandidates] = useState<
    Record<string, string[]>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const election = getElection(id || "");

  if (!election) {
    navigate("/dashboard");
    return null;
  }

  if (activePosition === "") {
    setActivePosition(election.positions[0].id);
  }

  const handleSelectCandidate = (positionId: string, candidateId: string) => {
    setSelectedCandidates((prev) => {
      const current = prev[positionId] || [];
      const position = election.positions.find((p) => p.id === positionId);

      if (!position) return prev;

      // For ranked choice, just add to the end if not already selected
      if (position.isRanked) {
        if (current.includes(candidateId)) {
          return {
            ...prev,
            [positionId]: current.filter((id) => id !== candidateId),
          };
        }

        // Add to the end if under max selections
        if (current.length < position.maxSelections) {
          return {
            ...prev,
            [positionId]: [...current, candidateId],
          };
        }

        return prev;
      }

      // For single choice
      if (position.maxSelections === 1) {
        return {
          ...prev,
          [positionId]: [candidateId],
        };
      }

      // For multiple choice
      if (current.includes(candidateId)) {
        return {
          ...prev,
          [positionId]: current.filter((id) => id !== candidateId),
        };
      }

      // Add if under max selections
      if (current.length < position.maxSelections) {
        return {
          ...prev,
          [positionId]: [...current, candidateId],
        };
      }

      return prev;
    });
  };

  const getCandidateRank = (positionId: string, candidateId: string) => {
    const selections = selectedCandidates[positionId] || [];
    const index = selections.indexOf(candidateId);
    return index !== -1 ? index + 1 : undefined;
  };

  const isPositionComplete = (position: Position) => {
    const selections = selectedCandidates[position.id] || [];
    return selections.length > 0;
  };

  const areAllPositionsComplete = () => {
    return election.positions.every((position) => isPositionComplete(position));
  };

  const handleSubmitVote = async () => {
    setIsSubmitting(true);

    try {
      // Submit votes for each position
      const promises = Object.entries(selectedCandidates).map(
        ([positionId, candidateIds]) => {
          return submitVote({
            electionId: election.id,
            positionId,
            candidateIds,
          });
        }
      );

      const results = await Promise.all(promises);

      if (results.every((result) => result)) {
        setShowConfirmDialog(false);
        setShowSuccessDialog(true);
      } else {
        toast({
          title: "Error",
          description:
            "There was a problem submitting your vote. Please try again.",
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
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <ElectionHeader election={election} />
          <CountdownTimer endDate={election.endDate} className="md:w-64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs
              value={activePosition}
              onValueChange={setActivePosition}
              className="mb-8"
            >
              <TabsList className="grid grid-cols-2 w-full">
                {election.positions.map((position) => {
                  const isVoted = hasVoted(election.id, position.id);
                  const isComplete = isPositionComplete(position);

                  return (
                    <TabsTrigger
                      key={position.id}
                      value={position.id}
                      disabled={isVoted}
                      className="relative"
                    >
                      {position.title}
                      {isVoted && (
                        <CheckCircle className="h-3 w-3 ml-1 text-green-500" />
                      )}
                      {!isVoted && isComplete && (
                        <div className="absolute top-1 right-1 h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {election.positions.map((position) => {
                const isVoted = hasVoted(election.id, position.id);

                return (
                  <TabsContent
                    key={position.id}
                    value={position.id}
                    className="mt-6"
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{position.title}</CardTitle>
                            <CardDescription>
                              {position.description}
                            </CardDescription>
                          </div>
                          {isVoted && (
                            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm px-3 py-1 rounded-full flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Vote Cast
                            </div>
                          )}
                        </div>

                        {!isVoted && (
                          <div className="text-sm mt-2">
                            {position.isRanked ? (
                              <p>
                                Rank up to {position.maxSelections} candidates
                                in order of preference.
                              </p>
                            ) : position.maxSelections > 1 ? (
                              <p>
                                Select up to {position.maxSelections}{" "}
                                candidates.
                              </p>
                            ) : (
                              <p>Select one candidate.</p>
                            )}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        {isVoted ? (
                          <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-md border border-green-200 dark:border-green-900 flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-3 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-800 dark:text-green-400">
                                Vote Recorded
                              </h4>
                              <p className="text-sm text-green-700 dark:text-green-500">
                                Your vote for this position has been
                                successfully recorded. You cannot change your
                                vote once submitted.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {position.candidates.map((candidate) => {
                              const isSelected = (
                                selectedCandidates[position.id] || []
                              ).includes(candidate.id);
                              const rank = position.isRanked
                                ? getCandidateRank(position.id, candidate.id)
                                : undefined;

                              return (
                                <CandidateCard
                                  key={candidate.id}
                                  candidate={candidate}
                                  isSelected={isSelected}
                                  onSelect={() =>
                                    handleSelectCandidate(
                                      position.id,
                                      candidate.id
                                    )
                                  }
                                  rank={rank}
                                />
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>

            <div className="flex justify-end">
              <Button
                onClick={() => setShowConfirmDialog(true)}
                disabled={
                  !areAllPositionsComplete() ||
                  election.positions.some((p) => hasVoted(election.id, p.id))
                }
              >
                Submit Votes
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Voting Progress</CardTitle>
                <CardDescription>Track your voting status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {election.positions.map((position) => {
                    const isVoted = hasVoted(election.id, position.id);
                    const isComplete = isPositionComplete(position);

                    return (
                      <div
                        key={position.id}
                        className="flex items-center justify-between"
                      >
                        <span className="font-medium">{position.title}</span>
                        {isVoted ? (
                          <span className="text-green-600 dark:text-green-500 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Voted
                          </span>
                        ) : isComplete ? (
                          <span className="text-blue-600 dark:text-blue-500">
                            Ready
                          </span>
                        ) : (
                          <span className="text-yellow-600 dark:text-yellow-500">
                            Pending
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!areAllPositionsComplete() &&
                  !election.positions.some((p) =>
                    hasVoted(election.id, p.id)
                  ) && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/50 rounded-md border border-yellow-200 dark:border-yellow-900 flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-400">
                          Incomplete Selections
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-500">
                          Please make selections for all positions before
                          submitting your votes.
                        </p>
                      </div>
                    </div>
                  )}

                {election.positions.some((p) =>
                  hasVoted(election.id, p.id)
                ) && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-md border border-blue-200 dark:border-blue-900 flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-400">
                        Votes Recorded
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-500">
                        Your votes have been recorded. Thank you for
                        participating in the election.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voting Instructions</CardTitle>
                <CardDescription>How to vote in this election</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Review each position and its candidates</li>
                  <li>Select your preferred candidate(s) for each position</li>
                  <li>
                    For ranked choice positions, select candidates in order of
                    preference
                  </li>
                  <li>Ensure you've made selections for all positions</li>
                  <li>Review your choices before submitting</li>
                  <li>Click "Submit Votes" to finalize your ballot</li>
                </ol>
                <div className="mt-4 text-sm text-muted-foreground">
                  <strong>Note:</strong> Once submitted, your votes cannot be
                  changed.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to submit your votes for the {election.title}. This
              action cannot be undone. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <h4 className="font-medium mb-2">Your selections:</h4>
            <div className="space-y-2">
              {election.positions.map((position) => {
                const selectedIds = selectedCandidates[position.id] || [];
                const selectedCandidateNames = selectedIds.map((id) => {
                  const candidate = position.candidates.find(
                    (c) => c.id === id
                  );
                  return candidate?.name || "Unknown";
                });

                return (
                  <div key={position.id}>
                    <span className="font-medium">{position.title}:</span>{" "}
                    {selectedCandidateNames.length > 0 ? (
                      position.isRanked ? (
                        <span>
                          {selectedCandidateNames.map((name, index) => (
                            <span key={index}>
                              {index + 1}. {name}
                              {index < selectedCandidateNames.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ))}
                        </span>
                      ) : (
                        selectedCandidateNames.join(", ")
                      )
                    ) : (
                      <span className="text-muted-foreground">
                        No selection
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitVote}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm Vote"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vote Successfully Submitted</AlertDialogTitle>
            <AlertDialogDescription>
              Your votes for the {election.title} have been successfully
              recorded. Thank you for participating in the election.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleFinish}>
              Return to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OngoingElection;
