import React from 'react';

const Avatar: React.FC = () => {
  return (
    <div className="relative">
      <div className="w-28 h-28 md:w-36 md:h-36 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center animate-pulse-slow">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-400 rounded-full flex items-center justify-center">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-blue-300 rounded-full animate-float"></div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;