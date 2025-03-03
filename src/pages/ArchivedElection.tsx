import { useParams, useNavigate } from 'react-router-dom';
import { useElection } from '@/contexts/ElectionContext';
import DashboardHeader from '@/components/DashboardHeader';
import ElectionHeader from '@/components/ElectionHeader';
import CandidateCard from '@/components/CandidateCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Users, Award, BarChart3 } from 'lucide-react';

const ArchivedElection = () => {
  const { id } = useParams<{ id: string }>();
  const { getElection } = useElection();
  const navigate = useNavigate();
  
  const election = getElection(id || '');
  
  if (!election) {
    navigate('/dashboard');
    return null;
  }
  
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
                <CardTitle>Election Results</CardTitle>
                <CardDescription>Final results for this election</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {election.positions.map(position => (
                    <div key={position.id} className="border-b pb-6 last:border-0 last:pb-0">
                      <h3 className="text-lg font-semibold mb-4">{position.title}</h3>
                      
                      {position.candidates.sort((a, b) => (b.votes || 0) - (a.votes || 0)).map((candidate, index) => (
                        <div key={candidate.id} className="mb-4 last:mb-0">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              {index === 0 && (
                                <Award className="h-4 w-4 text-yellow-500 mr-1" />
                              )}
                              <span className={index === 0 ? "font-medium" : ""}>{candidate.name}</span>
                            </div>
                            <span className="font-medium">{candidate.votes} votes</span>
                          </div>
                          <Progress 
                            value={(candidate.votes || 0) / (Math.max(...position.candidates.map(c => c.votes || 0)) || 1) * 100} 
                            className={index === 0 ? "h-2 bg-muted" : "h-2 bg-muted"}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue={election.positions[0].id} className="mb-8">
              <TabsList className="grid grid-cols-2 w-full">
                {election.positions.map(position => (
                  <TabsTrigger key={position.id} value={position.id}>
                    {position.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {election.positions.map(position => (
                <TabsContent key={position.id} value={position.id} className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{position.title} - Candidates</CardTitle>
                      <CardDescription>{position.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {position.candidates
                          .sort((a, b) => (b.votes || 0) - (a.votes || 0))
                          .map(candidate => (
                            <CandidateCard
                              key={candidate.id}
                              candidate={candidate}
                              isSelected={false}
                              onSelect={() => {}}
                              showVotes={true}
                            />
                          ))
                        }
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Election Statistics</CardTitle>
                <CardDescription>Voter turnout and participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Voter Turnout
                      </h4>
                      <span className="font-medium">
                        {Math.round((election.totalVotesCast || 0) / (election.totalVoters || 1) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(election.totalVotesCast || 0) / (election.totalVoters || 1) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>{election.totalVotesCast} votes cast</span>
                      <span>{election.totalVoters} eligible voters</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium flex items-center mb-4">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Position Breakdown
                    </h4>
                    
                    {election.positions.map(position => {
                      const totalVotes = position.candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
                      const winner = position.candidates.reduce((prev, current) => 
                        (prev.votes || 0) > (current.votes || 0) ? prev : current
                      );
                      
                      return (
                        <div key={position.id} className="mb-4 last:mb-0">
                          <div className="text-sm mb-1">{position.title}</div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Winner: {winner.name}</span>
                            <span>{totalVotes} total votes</span>
                          </div>
                          <Progress 
                            value={(winner.votes || 0) / (totalVotes || 1) * 100} 
                            className="h-1.5"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Election Summary</CardTitle>
                <CardDescription>Key information about this election</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium">Winners</h4>
                    <ul className="mt-1 space-y-1">
                      {election.positions.map(position => {
                        const winner = position.candidates.reduce((prev, current) => 
                          (prev.votes || 0) > (current.votes || 0) ? prev : current
                        );
                        
                        return (
                          <li key={position.id} className="flex justify-between">
                            <span>{position.title}:</span>
                            <span className="font-medium">{winner.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Participation</h4>
                    <div className="mt-1">
                      <div className="flex justify-between">
                        <span>Total eligible voters:</span>
                        <span>{election.totalVoters}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total votes cast:</span>
                        <span>{election.totalVotesCast}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Voter turnout:</span>
                        <span>{Math.round((election.totalVotesCast || 0) / (election.totalVoters || 1) * 100)}%</span>
                      </div>
                    </div>
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

export default ArchivedElection;

// export default ArchivedElection