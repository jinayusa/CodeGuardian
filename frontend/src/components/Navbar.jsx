import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">CodeGuardian</div>
        <div>
          <a href="#" className="px-4 hover:underline">
            Home
          </a>
          <a href="#" className="px-4 hover:underline">
            Reports
          </a>
          <a href="#" className="px-4 hover:underline">
            Settings
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;