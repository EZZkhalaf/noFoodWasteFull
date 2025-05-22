

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaBookBookmark } from "react-icons/fa6";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import UserElement from "./userElement";
import logo from "../assets/logo.png";
import { useAuthContext } from "../Context/AuthContext";

const ProfileNavBar = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileMenuRef = useRef(null);
  const { user, dispatch } = useAuthContext();

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "logout" });
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = useCallback(async (searchedUser) => {
    if (!searchedUser.trim()) return setUsers([]);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/user/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: searchedUser }),
      });

      const data = await response.json();
      setUsers(data === "no users found" ? [] : data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => handleSearch(query), 500);
    return () => clearTimeout(delay);
  }, [query, handleSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
  <header
    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-gray-100"
    }`}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            <img src={logo} alt="Logo" className="h-12" />
          </Link>
        </div>

        {/* Spacer + Controls */}
        <div className="flex-1 flex items-center justify-end">
          {/* Desktop Search (md+) */}
          <div className="hidden md:block w-1/3">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for Friends..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-spice-500 text-sm text-gray-800 bg-white placeholder-gray-400"
                />
                {query.trim() && (
                  <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg max-h-72 overflow-y-auto z-50">
                    {loading && <p className="text-center text-gray-500 text-xs p-2">Loading...</p>}
                    {error && <p className="text-center text-red-500 text-xs p-2">{error}</p>}
                    {users.length > 0 ? (
                      <ul className="space-y-2 p-2">
                        {users.map((u) => (
                          <UserElement key={u._id} user2={u} />
                        ))}
                      </ul>
                    ) : (
                      !loading && <p className="text-center text-gray-500 text-xs p-2">No users found</p>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Desktop Icons (md+) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Profile */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400"
                aria-label="Profile"
              >
                <CgProfile className="w-6 h-6 text-gray-700" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg py-1 z-50">

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Saved Recipes */}
            <NavLink
              to="/savedRecipes"
              className={({ isActive }) =>
                `flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400 ${
                  isActive ? "text-spice-500" : "text-gray-700"
                }`
              }
              aria-label="Saved Recipes"
            >
              <FaBookBookmark className="w-6 h-6" />
            </NavLink>
          </div>

          {/* Mobile Menu Toggle (<md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400 md:hidden"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <IoMdClose className="w-5 h-5 text-gray-700" />
            ) : (
              <IoMdMenu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col items-center bg-white shadow-md py-4 space-y-3">

          <NavLink
            to="/savedRecipes"
            className="px-4 py-2 text-gray-700 hover:text-spice-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            Saved Recipes
          </NavLink>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-700 hover:text-spice-500"
          >
            Logout
          </button>
          <form onSubmit={(e) => e.preventDefault()} className="w-[90%] mt-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for Friends..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-spice-500 text-sm text-gray-800 bg-white placeholder-gray-400"
              />
              {query.trim() && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg max-h-72 overflow-y-auto z-50">
                  {loading && <p className="text-center text-gray-500 text-xs p-2">Loading...</p>}
                  {error && <p className="text-center text-red-500 text-xs p-2">{error}</p>}
                  {users.length > 0 ? (
                    <ul className="space-y-2 p-2">
                      {users.map((u) => (
                        <UserElement key={u._id} user2={u} />
                      ))}
                    </ul>
                  ) : (
                    !loading && <p className="text-center text-gray-500 text-xs p-2">No users found</p>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  </header>
  );
};

export default ProfileNavBar;