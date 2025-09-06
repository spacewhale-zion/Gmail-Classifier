import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { Email } from "../types";
import sanitizeHtml from "sanitize-html";
import { gsap } from "gsap";

interface EmailCardProps {
  email: Email;
}

// Safe HTML stripping
const stripHtml = (html?: string): string => {
  if (!html) return "";
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
};

const EmailCard: React.FC<EmailCardProps> = ({ email }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      // Animate the card fading in from below safely
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, []);

  const formattedDate = new Date(email.receivedAt).toLocaleString();
  const plainTextBody = stripHtml(email.body);
  const previewText = plainTextBody.length > 150 ? plainTextBody.slice(0, 150) + "..." : plainTextBody;

  return (
    <Link to={`/email/${email.id}`}>
      <div
        ref={cardRef}
        className="bg-white rounded-xl shadow-md p-5 mb-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-gray-50"
      >
        {/* Header: Subject & Date */}
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{email.subject || "(No Subject)"}</h3>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>

        {/* From */}
        <p className="text-sm text-gray-600 truncate mb-2">{email.from || "Unknown sender"}</p>

        {/* Body preview */}
        <p
          className="text-gray-800 text-sm overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {previewText || "(No content)"}
        </p>
      </div>
    </Link>
  );
};

export default EmailCard;
