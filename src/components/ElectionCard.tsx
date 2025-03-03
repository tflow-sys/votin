import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Users2Icon } from 'lucide-react';
import { Election } from '@/contexts/ElectionContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';

interface ElectionCardProps {
  election: Election;
}

const ElectionCard = ({ election }: ElectionCardProps) => {
  const navigate = useNavigate();
  
  const handleViewElection = () => {
    if (election.status === 'ongoing') {
      navigate(`/ongoing-election/${election.id}`);
    } else if (election.status === 'archived') {
      navigate(`/archived-election/${election.id}`);
    } else {
      navigate(`/election/${election.id}`);
    }
  };
  
  const getStatusBadge = () => {
    switch (election.status) {
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>;
      case 'ongoing':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ongoing</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Archived</Badge>;
      default:
        return null;
    }
  };
  
  const getTimeInfo = () => {
    if (election.status === 'upcoming') {
      return `Starts ${formatDistanceToNow(new Date(election.startDate), { addSuffix: true })}`;
    } else if (election.status === 'ongoing') {
      return `Ends ${formatDistanceToNow(new Date(election.endDate), { addSuffix: true })}`;
    } else {
      return `Ended on ${format(new Date(election.endDate), 'PPP')}`;
    }
  };

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{election.title}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>{election.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getTimeInfo()}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users2Icon className="mr-2 h-4 w-4" />
            {election.positions.length} position{election.positions.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleViewElection} 
          variant={election.status === 'ongoing' ? "default" : "outline"}
          className="w-full"
        >
          {election.status === 'ongoing' ? 'Vote Now' : 'View Details'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ElectionCard;