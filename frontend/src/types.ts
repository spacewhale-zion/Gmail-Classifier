export interface Email {
  id: string;
  subject: string;
  from: string;
  body: string;
  receivedAt: Date;
  category?: string;
}


export interface UserCategory {
  name: string;
  keywords: string[];
}