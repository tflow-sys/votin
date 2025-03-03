import { useEffect, useState } from 'react';
import { useElection } from '@/contexts/ElectionContext';
import DashboardHeader from '@/components/DashboardHeader';
import ElectionCard from '@/components/ElectionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { getUpcomingElections, getOngoingElections, getArchivedElections } = useElection();
  const [activeTab, setActiveTab] = useState('ongoing');
  
  // Get elections based on their status
  const upcomingElections = getUpcomingElections();
  const ongoingElections = getOngoingElections();
  const archivedElections = getArchivedElections();
  
  // Set default tab based on available elections
  useEffect(() => {
    if (ongoingElections.length > 0) {
      setActiveTab('ongoing');
    } else if (upcomingElections.length > 0) {
      setActiveTab('upcoming');
    } else {
      setActiveTab('archived');
    }
  }, [ongoingElections.length, upcomingElections.length]);
  
  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'Faculty Representatives Election is now live',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      title: 'Guild Presidential Elections scheduled for March 1st',
      time: '1 day ago',
      read: true
    },
    {
      id: 3,
      title: 'Last year\'s election results are now available',
      time: '3 days ago',
      read: true
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Student Elections Dashboard</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ongoing" className="relative">
                  Ongoing
                  {ongoingElections.length > 0 && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ongoing" className="mt-6">
                {ongoingElections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ongoingElections.map(election => (
                      <ElectionCard key={election.id} election={election} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-8">
                      <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Ongoing Elections</h3>
                      <p className="text-muted-foreground">
                        There are no elections currently in progress. Check the upcoming tab for scheduled elections.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-6">
                {upcomingElections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingElections.map(election => (
                      <ElectionCard key={election.id} election={election} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Upcoming Elections</h3>
                      <p className="text-muted-foreground">
                        There are no elections scheduled at the moment. Check back later for updates.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="archived" className="mt-6">
                {archivedElections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {archivedElections.map(election => (
                      <ElectionCard key={election.id} election={election} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-8">
                      <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Archived Elections</h3>
                      <p className="text-muted-foreground">
                        There are no past elections in the archive. Once elections are completed, they will appear here.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div>
            {/* Election Calendar */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Election Calendar
                </CardTitle>
                <CardDescription>Upcoming election dates</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingElections.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingElections.map(election => (
                      <div key={election.id} className="border-b pb-3 last:border-0 last:pb-0">
                        <h4 className="font-medium">{election.title}</h4>
                        <div className="text-sm text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <span className="font-medium">Start:</span>
                            <span className="ml-2">{format(new Date(election.startDate), 'PPP')}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">End:</span>
                            <span className="ml-2">{format(new Date(election.endDate), 'PPP')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No upcoming elections scheduled.</p>
                )}
              </CardContent>
            </Card>
            
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
                <CardDescription>Recent updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`border-b pb-3 last:border-0 last:pb-0 ${!notification.read ? 'bg-muted/50 -mx-2 px-2 py-2 rounded' : ''}`}
                    >
                      <h4 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;