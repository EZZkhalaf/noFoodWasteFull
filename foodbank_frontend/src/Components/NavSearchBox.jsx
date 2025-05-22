import React, { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import UserElement from "./userElement";

const NavSearchBox = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="fixed inset-0 flex  justify-center p-6   z-50">
      <div className=" rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out origin-top w-full max-w-md transform">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col items-center p-4"
        >
          {/* Search Bar */}
          <div className="flex w-full items-center border-b border-gray-200 pb-2">
            <input
              type="text"
              placeholder="Search for Friends..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400"
            />
            <div className="flex space-x-2 ml-2">
              <button
                type="submit"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Search className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Results Container */}
          <div className="w-full mt-4">
            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-xs text-center p-2">{error}</p>
            )}

            {/* Loading Message */}
            {loading && (
              <p className="text-center text-gray-500 text-xs p-2">Loading...</p>
            )}

            {/* Results List */}
            {users.length > 0 && (
              <ul className="space-y-2 max-h-72 overflow-y-auto">
                {users.map((user) => (
                  <UserElement key={user._id} user2={user} />
                ))}
              </ul>
            )}

            {/* Empty State */}
            {users.length === 0 && !loading && !error && query.trim() && (
              <p className="text-center text-gray-500 text-xs p-2">
                No users found
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NavSearchBox;