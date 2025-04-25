import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const navItems = [
  { id: "HOME", displayText: "Home", path: "/" },
  { id: "DENTISTS", displayText: "Dentists", path: "/dentists" },
  { id: "APPOINTMENTS", displayText: "Appointments", path: "/appointments" },
  
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwtToken'));
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('jwtToken'));
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div
          className="text-3xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <span className="text-yellow-500">Dental</span>Care
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="block md:hidden text-blue-600 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {/* Navigation Menu */}
        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-white md:static md:block md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row md:gap-8 md:items-center">
            {navItems.map((item) => (
              <li
                key={item.id}
                className="py-2 px-4 md:py-0 md:px-0 text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(item.path);
                }}
              >
                {item.displayText}
              </li>
            ))}
            <li className="py-2 px-4 md:py-0 md:px-0">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition w-full md:w-auto"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition w-full md:w-auto"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;