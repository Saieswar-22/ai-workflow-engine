import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Settings, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <LayoutDashboard className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">SaaS Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4 mr-2" />
                {user?.full_name || user?.email}
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-5 py-6 sm:px-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Welcome to your Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                    <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">Feature Module {i}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This is a placeholder for your SaaS features. Integrate AI workflows or other modules here.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
