import React, { useEffect, useState } from 'react';
import EmailCard from './EmailCard';

// import type { Email } from '../types/Email';
// src/types/Email.ts
export interface Email {
  id: string;
  subject: string;
  from: string;
  body: string;
  category?: string; // optional if you want
}

const EmailList: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    fetch('http://localhost:3000/api/emails')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setEmails(data.emails);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading emails...</div>;
  if (emails.length === 0) return <div>No emails found.</div>;

  return (
    <div>
      {emails.map((email, idx) => (
        <EmailCard key={idx} email={email} /> // email prop MUST match EmailCardProps
      ))}
    </div>
  );
};

export default EmailList;
