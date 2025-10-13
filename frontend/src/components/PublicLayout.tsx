import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Button } from './ui/button';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-xl">
                🚕
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Jez Cabs
              </h1>
            </div>

            <div className="flex gap-3">
              <Button
                asChild
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <RouterLink to="/login">
                  Login
                </RouterLink>
              </Button>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RouterLink to="/register">
                  Sign Up
                </RouterLink>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-xl">
                🚕
              </div>
              <h2 className="text-xl font-bold">
                Jez Cabs Management Platform
              </h2>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              Streamline your cab business operations with our comprehensive management platform.
              Manage fleets, drivers, bookings, and analytics all in one place.
            </p>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex justify-center gap-8 mb-6 flex-wrap">
              <RouterLink
                to="/login"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Sign Up
              </RouterLink>
            </div>

            <p className="text-gray-500 text-center text-sm">
              © {new Date().getFullYear()} Jez Cabs Management Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
