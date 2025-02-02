import React from 'react';

function Navbar() {
  // Handle logout functionality
  const handleLogout = () => {
    console.log("User logged out");
    // Add your logout logic here (e.g., clear session, redirect to login page)
  };

  return (
    <nav className="bg-blue-600 p-4 fixed w-full top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <div className="text-white font-semibold text-xl">My App</div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;