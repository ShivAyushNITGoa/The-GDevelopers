"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to <span className="text-blue-600 dark:text-blue-400">GDevelopers</span>
        </h1>
        <p className="mt-3 text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
          Your trusted partner for web development, design, and digital solutions
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-6xl">
            {[
              {
                title: "Modern Web Development",
              description: "Building responsive, accessible, and performant websites using the latest technologies.",
                icon: "🌐",
              },
              {
                title: "Mobile Applications",
              description: "Creating native and cross-platform mobile experiences that delight users.",
                icon: "📱",
              },
              {
                title: "UI/UX Design",
              description: "Crafting beautiful, intuitive user interfaces and experiences.",
                icon: "🎨",
              },
            ].map((feature, index) => (
              <div 
                key={index} 
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <a
            href="/about"
            className="px-8 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="px-8 py-3 rounded-md bg-white text-blue-600 font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </main>
    </div>
  );
} 