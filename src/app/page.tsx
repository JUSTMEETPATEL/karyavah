"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Profile } from "@/components/global/profile";
import { useSession } from "@/lib/auth-client";

export default function HomePage() {
  

  const session = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Karyavah</h1>
            </div>

            <nav className="hidden md:flex">
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Browse
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Services
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                About
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              {session.data?.user.id ? (
                <div className="flex items-center space-x-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Post a Job
                  </Button>
                  <Profile />
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    href="/sign-in"
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-400 rounded-2xl px-12 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Find the perfect freelancer for your project
          </h2>
          <p className="text-white text-lg max-w-3xl mx-auto leading-relaxed">
            Connect with top-rated professionals for any task, from web
            development to graphic design. Karyavah also offers bidirectional
            services, allowing users to post jobs for workers to apply.
          </p>
        </div>
      </section>

      {/* Popular Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">
          Popular Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Web Development */}
          <div className="bg-orange-200 rounded-2xl p-6">
            <div className="bg-white rounded-lg p-6 mb-4 h-32 flex items-center justify-center">
              <div className="w-full h-20 bg-gray-100 rounded border-t-4 border-teal-600 relative">
                <div className="absolute top-2 left-2 w-4 h-4 bg-green-500 rounded-full"></div>
                <div className="absolute top-2 right-2 w-6 h-6 bg-green-600 rounded"></div>
                <div className="absolute bottom-2 left-2 right-2 h-2 bg-gray-300 rounded"></div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Web Development
            </h4>
            <p className="text-sm text-gray-600">
              Build your online presence with expert developers.
            </p>
          </div>

          {/* Graphic Design */}
          <div className="bg-orange-200 rounded-2xl p-6">
            <div className="bg-white rounded-lg p-6 mb-4 h-32 flex items-center justify-center">
              <div className="w-20 h-24 bg-white border-4 border-gray-300 rounded relative">
                <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-green-600 rounded"></div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Graphic Design</h4>
            <p className="text-sm text-gray-600">
              Create stunning visuals that captivate your audience.
            </p>
          </div>

          {/* Content Writing */}
          <div className="bg-orange-200 rounded-2xl p-6">
            <div className="bg-white rounded-lg p-6 mb-4 h-32 flex items-center justify-center">
              <div className="w-20 h-20 bg-teal-600 rounded-full relative overflow-hidden">
                <div className="absolute inset-2 bg-teal-700 rounded-full"></div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Content Writing
            </h4>
            <p className="text-sm text-gray-600">
              Craft compelling content that drives engagement.
            </p>
          </div>

          {/* Digital Marketing */}
          <div className="bg-orange-200 rounded-2xl p-6">
            <div className="bg-white rounded-lg p-6 mb-4 h-32 flex items-center justify-center">
              <div className="flex space-x-2">
                <div className="w-12 h-16 bg-gray-100 border border-gray-300 rounded p-1">
                  <div className="w-full h-2 bg-teal-600 rounded mb-1"></div>
                  <div className="w-full h-8 bg-green-500 rounded"></div>
                </div>
                <div className="w-12 h-20 bg-gray-100 border border-gray-300 rounded p-1">
                  <div className="w-full h-2 bg-teal-600 rounded mb-1"></div>
                  <div className="w-full h-12 bg-green-500 rounded"></div>
                </div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Digital Marketing
            </h4>
            <p className="text-sm text-gray-600">
              Reach your target audience with effective marketing strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">
          Additional Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Painting */}
          <div className="bg-orange-100 rounded-2xl p-8">
            <div className="bg-white rounded-lg p-8 mb-6 h-48 flex items-center justify-center">
              <div className="w-32 h-40 bg-white border-4 border-gray-300 rounded relative">
                <div className="absolute inset-4 flex items-center justify-center">
                  <div className="w-16 h-20 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-12 bg-green-600 rounded-full"></div>
                    <div className="absolute top-8 left-0 w-6 h-8 bg-green-500 rounded-full"></div>
                    <div className="absolute top-8 right-0 w-6 h-8 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-lg">
              Painting
            </h4>
            <p className="text-gray-600">
              Transform your space with professional painting services.
            </p>
          </div>

          {/* Gardening */}
          <div className="bg-orange-100 rounded-2xl p-8">
            <div className="bg-white rounded-lg p-8 mb-6 h-48 flex items-center justify-center">
              <div className="w-32 h-40 bg-white border-4 border-gray-300 rounded relative">
                <div className="absolute inset-4 flex items-end justify-center space-x-2">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-8 bg-green-600 rounded-full mb-1"></div>
                    <div className="w-6 h-4 bg-orange-400 rounded"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-12 bg-green-500 rounded-full mb-1"></div>
                    <div className="w-8 h-4 bg-orange-400 rounded"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-6 bg-green-600 rounded-full mb-1"></div>
                    <div className="w-6 h-4 bg-orange-400 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-lg">
              Gardening
            </h4>
            <p className="text-gray-600">
              Maintain a beautiful outdoor area with expert gardening.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h3>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our community of talented professionals and innovative clients.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium">
          Get Started
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Contact
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Privacy Policy
              </a>
            </div>

            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Karyavah. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
