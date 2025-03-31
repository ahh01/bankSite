"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl text-black font-bold mb-6">Välkommen</h1>
      <Link
        href="/login"
        className="w-full max-w-xs bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Logga in
      </Link>
      <Link
        href="/newuser"
        className="w-full max-w-xs mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-center hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        Skapa ett konto
      </Link>
    </div>
  );
}