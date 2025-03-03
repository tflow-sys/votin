import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Candidate } from '@/contexts/ElectionContext';
import { cn } from '@/lib/utils';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  rank?: number;
  showVotes?: boolean;
}

const CandidateCard = ({ 
  candidate, 
  isSelected, 
  onSelect, 
  disabled = false,
  rank,
  showVotes = false
}: CandidateCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className={cn(
      "transition-all",
      isSelected ? "border-primary ring-2 ring-primary ring-opacity-50" : "",
      disabled ? "opacity-60" : "hover:shadow-md"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={candidate.imageUrl} alt={candidate.name} />
              <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{candidate.name}</CardTitle>
              <CardDescription>{candidate.position}</CardDescription>
            </div>
          </div>
          {rank && (
            <Badge variant="secondary" className="text-lg px-3 py-1">
              #{rank}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{candidate.manifesto}</p>
        
        {showVotes && candidate.votes !== undefined && (
          <div className="mt-4">
            <div className="text-sm font-medium">Votes received</div>
            <div className="flex items-center mt-1">
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${(candidate.votes / 3000) * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium">{candidate.votes}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!showVotes && (
          <Button 
            onClick={onSelect} 
            variant={isSelected ? "default" : "outline"} 
            className="w-full"
            disabled={disabled}
          >
            {isSelected ? (rank ? `Selected as #${rank}` : 'Selected') : 'Select'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;