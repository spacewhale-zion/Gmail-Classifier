import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, Settings } from "lucide-react";

interface NavbarProps {
  userId: string;
  userName: string;
  emailsCount: number;
  filteredEmailsCount: number;
  // unreadCount: number;
}

const Navbar: React.FC<NavbarProps> = ({
  userId,
  userName,
  emailsCount,
  filteredEmailsCount,
  // unreadCount,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here (API call)
    navigate("/login");
  };

  const handleManageCategories = () => {
    navigate("/manage-categories");
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg mr-3">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Email Dashboard
              </h1>
              <p className="text-sm text-gray-500">Manage your emails efficiently</p>
            </div>
          </div>

          {/* Right: Stats & User */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4 text-sm">
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-blue-600 font-medium">{filteredEmailsCount}</span>
                <span className="text-gray-500 ml-1">of {emailsCount} emails</span>
              </div>
           
            </div>

            {/* User */}
            {userId && (
              <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-700 font-medium text-sm">{userName}</span>
              </div>
            )}

            {/* Manage Categories Button */}
            <button
              onClick={handleManageCategories}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              Manage Categories
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>

            {/* Settings Icon */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
