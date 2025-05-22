

import React, { useEffect, useState } from 'react';
import profilePhoto from '../assets/profilePhoto.png'
import { ThreeDot } from 'react-loading-indicators';
import { Link } from 'react-router-dom';

const UserFollowModal = ({ users: userIds, onClose, title = "Users" }) => {
  //  hold the fetched user objects
  const [profiles, setProfiles] = useState([]);
  const [loading , setLoading] = useState(false);

  useEffect(() => {
    const getTheUsersData = async () => {
        setLoading(true)
      try {
        const response = await fetch(
          "http://localhost:3000/user/getMultiUsersById",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIds }), // send the IDs
          }
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setProfiles(data);   // 2️⃣ store them
      } catch (error) {
        console.error("Failed to load users:", error);
      }finally{
        setLoading(false)
      }
    };

    getTheUsersData();
  }, []); // runs once on mount/open

  console.log(profiles)


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>
  
        {/* Body */}
        {loading ? (
          <div className="flex justify-center py-10">
            <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.length > 0 ? (
              profiles.map((u) => (
                <Link
                    to={`/userPage/${u._id}`}
                    >
                    <div key={u._id} className="flex items-center gap-4">
                    <img
                        src={
                            u.profilePic?.startsWith("data:image/") || 
                            u.profilePic?.startsWith("http")
                            ? u.profilePic
                            : profilePhoto
                        }
                        alt={u.username}
                        className="w-10 h-10 rounded-full object-cover"
                    />

                    <span className="text-gray-800 font-medium">{u.username}</span>
                    </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No users found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFollowModal;
