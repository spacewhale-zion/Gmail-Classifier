import React from 'react';
import { Mail } from 'lucide-react';
export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);



  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <Mail className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-normal text-gray-900 mb-3">
              Sign in
            </h2>
            <p className="text-base text-gray-600 mb-8">
              to continue to Gmail
            </p>
          </div>

          {/* Google Sign In Button */}
          <div className="space-y-6">
            <button
               onClick={() => {
    setIsLoading(true);
    window.location.href = "http://localhost:5000/auth/google";
  }}
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center py-4 px-6 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-3" />
              ) : (
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>


            {/* Additional info */}
            <div className="text-center pt-4">
              <p className="text-xs text-gray-400 mb-4">
                By continuing, you agree to Google's Terms of Service and Privacy Policy
              </p>
              
            </div>
          </div>

      
        </div>
      </div>

      {/* Right side - Illustration/Background */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10" />
          
          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-purple-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-indigo-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Central illustration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-8">
              <div className="w-40 h-40 mx-auto bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                <Mail className="w-20 h-20 text-blue-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-light text-gray-800">
                  Welcome to Gmail
                </h3>
               
              </div>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto pt-8">
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Secure authentication</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Access from anywhere</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Sync across devices</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;