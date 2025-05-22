
import React, { useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { useAuthContext } from "../Context/AuthContext";
import { IoMdDoneAll } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import defaultPhoto from '../assets/defaultPhoto.png'; 


const UserElement = ({ user2 }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const [successfullyAdded, setAdded] = useState(false);


  const isBase64 = (picture) => {
    if(!picture) return false;
    try {
      //check if picture hase the base64 value format 
      if (!/^data:image\/(png|jpe?g|gif|webp);base64,/.test(picture)) {
        return false;
      }
      //boa for encoding the string and atob for decoding the string 
       // Decode and re-encode to verify
      return btoa(atob(picture.split(',')[1])) === picture.split(',')[1];    } catch (error) {
      return false;
    }
  };
  return (
    <Link 
      to={`/userPage/${user2._id}`}
    >
    <div 
      // onClick={}
      className="flex items-center justify-between p-3 border-b border-gray-200 w-full bg-gray-100 rounded-md shadow-md">
        <div className="flex items-center">
          <img
            src={isBase64(user2.profilePic)?user2.profilePic :  defaultPhoto}
            // alt={`${user2.username}'s profile`}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <span className="font-semibold text-gray-800">{user2.username}</span>
        </div>

        {successfullyAdded ? (
          <></>
        ) : (
          // <IoPersonAdd
          //   onClick={followUser}
          //   className={`text-2xl cursor-pointer ${
          //     loading ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:text-blue-700"
          //   }`}
          //   disabled={loading}
          // />
          <div></div>
        )}
    </div>
        </Link>
  );
};

export default UserElement;
