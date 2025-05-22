import React, { useEffect, useState } from 'react';
import HeroImage from '../assets/HeroImage.png'; // Importing the Hero image
import { useNavigate } from 'react-router-dom';

const Hero = ({ user }) => {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true); // Trigger animation once when the component mounts
  }, []);

  // Inline style for animation
  const animationStyle = {
    animation: animate ? 'moveRightLeft 1s ease-out forwards' : 'none',
  };

  return (
    <section
      className="flex items-center justify-center p-16 bg-cover bg-center text-black mt-2.5 transition-all duration-1000"
      style={{ ...animationStyle, backgroundImage: `url(${HeroImage})` }} 
    >
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">
          {user ? `Welcome to Our Recipe World, ${user.username}!` : 'Welcome to Our Recipe World!'}
        </h1>
        <p className="text-lg">
          Discover amazing recipes based on the ingredients you have.
        </p>
      </div>

      <style>{`
        @keyframes moveRightLeft {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
