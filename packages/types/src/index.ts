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

export interface Agent {
  id: number;
  name: string;
  description: string;
  endpoint: string;
  capabilities: string[];
  owner: string;
  isActive: boolean;
  createdAt: number;
}

export interface RegisterAgentParams {
  name: string;
  description: string;
  endpoint: string;
  capabilities: string[];
}

export interface UpdateAgentParams extends RegisterAgentParams {
  id: number;
}
