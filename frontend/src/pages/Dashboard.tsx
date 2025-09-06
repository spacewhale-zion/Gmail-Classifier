import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import EmailCard from "../components/EmailCard";
import SearchFilterBar from "../components/SearchBar";
import type { Email } from "../types";
import axios from "axios";

interface UserCategory {
  _id: string;
  name: string;
  keywords: string[];
}

const Dashboard: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [userCategories, setUserCategories] = useState<UserCategory[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>(""); // friendly name
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [activeCategory, setActiveCategory] = useState("all");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserId(data.id);
          setUserName(data.name || data.email || "User"); // friendly display
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  // Fetch user categories
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/categories/${userId}`)
      .then((res) => setUserCategories(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  // Listen for emails via socket.io
useEffect(() => {
  const socket: any = io("http://localhost:5000", { withCredentials: true });

  socket.on("emails", setEmails);

  return () => {
    socket.disconnect();
  };
}, []);


  // Handle category filter
  const handleFilter = (category: string) => setActiveCategory(category);

  // Compute filtered emails
  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      // Category filter
      if (activeCategory !== "all") {
        const cat = userCategories.find((c) => c.name === activeCategory);
        if (cat) {
          const keywords = cat.keywords.map((k) => k.toLowerCase());
          if (
            !keywords.some((k) =>
              (email.subject ?? email.body ?? "").toLowerCase().includes(k)
            )
          )
            return false;
        }
      }
      // Search filter
      if (debouncedSearch) {
        const term = debouncedSearch.toLowerCase();
        const combined = [email.subject, email.body, email.from].join(" ").toLowerCase();
        if (!combined.includes(term)) return false;
      }
      return true;
    });
  }, [emails, userCategories, activeCategory, debouncedSearch]);

  

  return (
    <div>
      {/* Navbar */}
      <Navbar
        userId={userId ?? ""}
        userName={userName}
        emailsCount={emails.length}
        filteredEmailsCount={filteredEmails.length}
        // unreadCount={unreadCount}
      />

      {/* Search & Category Filter */}
      <div className="p-4">
        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={activeCategory}
          handleCategoryChange={handleFilter}
          userCategories={userCategories}
        />

        {/* Emails */}
        <div className="space-y-4 mt-4">
          {filteredEmails.length === 0 ? (
            <div className="text-gray-500 text-center p-6 bg-white rounded shadow">
              No emails found
            </div>
          ) : (
            filteredEmails.map((email) => <EmailCard key={email.id} email={email} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
