import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
  import { io } from "socket.io-client";

import type { Email } from "../types";

const EmailDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [email, setEmail] = useState<Email | null>(null);


useEffect(() => {
  const socket = io("http://localhost:5000", { withCredentials: true });

  socket.on("emails", async (data: Email[]) => {
    const selectedEmail = data.find((e: Email) => e.id === id);
    if (!selectedEmail) return;

    // Fetch HTML content if externalUrl exists
    if (selectedEmail.externalUrl) {
      const proxyRes = await fetch(
        `http://localhost:5000/email-proxy/proxy?url=${encodeURIComponent(selectedEmail.externalUrl)}`,
        { credentials: "include" }
      );
      const html = await proxyRes.text();
      selectedEmail.body = html;
    }

    setEmail(selectedEmail);
  });

  return () => {
    socket.disconnect();
  };
}, [id]);

  if (!email) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
 

      <div className="flex-1 p-6">
        <Link to="/dashboard" className="text-blue-500 underline mb-4 inline-block">
          ← Back to Inbox
        </Link>

        <div className="bg-white rounded shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">{email.subject}</h1>
          <div className="flex items-center justify-between text-gray-600">
            <p>From: <span className="font-medium text-gray-900">{email.from}</span></p>
            {email.category && <span className="px-2 py-1 text-sm bg-gray-200 rounded">{email.category}</span>}
          </div>
        </div>

        <div
          className="bg-white rounded shadow p-6"
          dangerouslySetInnerHTML={{ __html: email.body }}
        />
      </div>
    </div>
  );
};

export default EmailDetail;
