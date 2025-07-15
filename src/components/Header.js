// src/components/Header.jsx
import React from 'react';

export default function Header() {
  return (
    <header className="pb-4 border-b shadow-sm flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Employee Dashboard</h1>
      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
        HR
      </div>
    </header>
  );
}
