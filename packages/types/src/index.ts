export interface User {
  id: string;
  address: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: Date;
}

export type Status = 'pending' | 'completed' | 'failed';
