import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Election } from '@/contexts/ElectionContext';
import { format } from 'date-fns';

interface ElectionHeaderProps {
  election: Election;
  showBackButton?: boolean;
  backTo?: string;
}

const ElectionHeader = ({ 
  election, 
  showBackButton = true,
  backTo = '/dashboard'
}: ElectionHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      {showBackButton && (
        <Button 
          variant="ghost" 
          className="mb-2 p-0 h-auto" 
          onClick={() => navigate(backTo)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      )}
      
      <h1 className="text-3xl font-bold">{election.title}</h1>
      <p className="text-muted-foreground mt-1">{election.description}</p>
      
      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-muted-foreground">
        <div>
          <span className="font-medium">Start:</span> {format(new Date(election.startDate), 'PPP p')}
        </div>
        <div>
          <span className="font-medium">End:</span> {format(new Date(election.endDate), 'PPP p')}
        </div>
        <div>
          <span className="font-medium">Positions:</span> {election.positions.length}
        </div>
      </div>
    </div>
  );
};

export default ElectionHeader;