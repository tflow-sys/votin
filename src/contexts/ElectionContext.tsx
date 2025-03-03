import { createContext, useContext, useState, ReactNode } from "react";

export interface Candidate {
  id: string;
  name: string;
  position: string;
  manifesto: string;
  imageUrl: string;
  votes?: number;
}

export interface Position {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
  maxSelections: number;
  isRanked: boolean;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "archived";
  positions: Position[];
  totalVoters?: number;
  totalVotesCast?: number;
}

interface Vote {
  electionId: string;
  positionId: string;
  candidateIds: string[];
}

interface ElectionContextType {
  elections: Election[];
  getElection: (id: string) => Election | undefined;
  getUpcomingElections: () => Election[];
  getOngoingElections: () => Election[];
  getArchivedElections: () => Election[];
  submitVote: (vote: Vote) => Promise<boolean>;
  hasVoted: (electionId: string, positionId: string) => boolean;
}

const ElectionContext = createContext<ElectionContextType | undefined>(
  undefined
);

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error("useElection must be used within an ElectionProvider");
  }
  return context;
};

interface ElectionProviderProps {
  children: ReactNode;
}

export const ElectionProvider = ({ children }: ElectionProviderProps) => {
  // Mock elections data
  const elections: Election[] = [
    {
      id: "1",
      title: "2025 Guild Presidential Elections",
      description:
        "Annual election for the Guild President and other leadership positions",
      startDate: "2025-03-01T08:00:00Z",
      endDate: "2025-03-03T17:00:00Z",
      status: "upcoming",
      positions: [
        {
          id: "pos1",
          title: "Guild President",
          description: "The overall leader of the student body",
          maxSelections: 1,
          isRanked: false,
          candidates: [
            {
              id: "cand1",
              name: "Joel Captain",
              position: "Guild President",
              manifesto: "Building a better campus for all students",
              imageUrl:
                "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
            },
            {
              id: "cand2",
              name: "John Smith",
              position: "Guild President",
              manifesto: "Advocating for student rights and welfare",
              imageUrl:
                "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100432",
            },
          ],
        },
        {
          id: "pos2",
          title: "Academic Affairs Minister",
          description: "Responsible for academic matters",
          maxSelections: 1,
          isRanked: false,
          candidates: [
            {
              id: "cand3",
              name: "Tashah Desire",
              position: "Academic Affairs Minister",
              manifesto: "Improving academic resources and support",
              imageUrl:
                "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100539",
            },
            {
              id: "cand4",
              name: "Bob Williams",
              position: "Academic Affairs Minister",
              manifesto: "Creating a conducive learning environment",
              imageUrl:
                "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100432",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      title: "Faculty Representatives Election",
      description: "Election for faculty representatives",
      startDate: "2025-02-01T08:00:00Z",
      endDate: "2025-02-10T17:00:00Z",
      status: "ongoing",
      positions: [
        {
          id: "pos3",
          title: "Science Faculty Representative",
          description: "Represents students in the Science Faculty",
          maxSelections: 1,
          isRanked: false,
          candidates: [
            {
              id: "cand5",
              name: "Bukenya Sarah",
              position: "Science Faculty Representative",
              manifesto: "Enhancing laboratory facilities",
              imageUrl:
                "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2400100102",
            },
            {
              id: "cand6",
              name: "David Lee",
              position: "Science Faculty Representative",
              manifesto: "Promoting research opportunities",
              imageUrl:
                "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100432",
            },
          ],
        },
        {
          id: "pos4",
          title: "Business Faculty Representative",
          description: "Represents students in the Business Faculty",
          maxSelections: 2,
          isRanked: true,
          candidates: [
            {
              id: "cand7",
              name: "Mugerwa Joseph",
              position: "Business Faculty Representative",
              manifesto: "Creating industry connections",
              imageUrl:
                "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100432",
            },
            {
              id: "cand8",
              name: "Frank Wilson",
              position: "Business Faculty Representative",
              manifesto: "Organizing business workshops",
              imageUrl:
                "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2200100432",
            },
            {
              id: "cand9",
              name: "Grace Taylor",
              position: "Business Faculty Representative",
              manifesto: "Improving internship opportunities",
              imageUrl:
                "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2400100102",
            },
          ],
        },
      ],
    },
    {
      id: "3",
      title: "2024 Guild Presidential Elections",
      description: "Previous year's Guild Presidential Elections",
      startDate: "2024-03-01T08:00:00Z",
      endDate: "2024-03-03T17:00:00Z",
      status: "archived",
      totalVoters: 5000,
      totalVotesCast: 3750,
      positions: [
        {
          id: "pos5",
          title: "Guild President",
          description: "The overall leader of the student body",
          maxSelections: 1,
          isRanked: false,
          candidates: [
            {
              id: "cand10",
              name: "Musiitwa Joel",
              position: "Guild President",
              manifesto: "Student welfare first",
              imageUrl:
                "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
              votes: 2000,
            },
            {
              id: "cand11",
              name: "Jack Moore",
              position: "Guild President",
              manifesto: "Transparency and accountability",
              imageUrl:
                "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100432",
              votes: 1750,
            },
          ],
        },
      ],
    },
  ];

  // Mock voted positions to track which positions a user has voted for
  const [votedPositions, setVotedPositions] = useState<{
    [key: string]: boolean;
  }>({});

  const getElection = (id: string) => {
    return elections.find((election) => election.id === id);
  };

  const getUpcomingElections = () => {
    return elections.filter((election) => election.status === "upcoming");
  };

  const getOngoingElections = () => {
    return elections.filter((election) => election.status === "ongoing");
  };

  const getArchivedElections = () => {
    return elections.filter((election) => election.status === "archived");
  };

  const submitVote = async (vote: Vote): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mark this position as voted
      setVotedPositions((prev) => ({
        ...prev,
        [`${vote.electionId}-${vote.positionId}`]: true,
      }));

      return true;
    } catch (error) {
      console.error("Vote submission error:", error);
      return false;
    }
  };

  const hasVoted = (electionId: string, positionId: string): boolean => {
    return !!votedPositions[`${electionId}-${positionId}`];
  };

  const value = {
    elections,
    getElection,
    getUpcomingElections,
    getOngoingElections,
    getArchivedElections,
    submitVote,
    hasVoted,
  };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
};
