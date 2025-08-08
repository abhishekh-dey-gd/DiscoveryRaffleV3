export interface Contestant {
  name: string;
  department: string;
  supervisor: string;
}

export interface Winner extends Contestant {
  id: string;
  drawDate: Date;
}

export interface AuthData {
  username: string;
  password: string;
}

export type Department = 'International Messaging' | 'India Messaging' | 'APAC';