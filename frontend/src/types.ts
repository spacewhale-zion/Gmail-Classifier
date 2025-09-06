export interface Email {
  id: string;
  subject: string;
  from: string;
  body: string;
  receivedAt: Date;
  category?: string;
  externalUrl?: string; // optional: URL for external email

}


export interface UserCategory {
  name: string;
  keywords: string[];
}