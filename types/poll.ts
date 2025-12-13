
// 🔹 Core Poll Types
export interface PollItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  votes: number;
}

// 🔹 Aggregated Poll Data
export interface PollData {
  id: string;
  title: string;
  question: string;
  endsIn: string;
  totalVotes: number;
  restaurant: {
    name: string;
    location: string;
    description: string;
    avatar: string;
    website: string;
  };
  items: PollItem[];
  createdAt: number;
}
