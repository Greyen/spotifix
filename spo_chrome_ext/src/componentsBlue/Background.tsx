import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-navy-950 overflow-hidden">
      {/* Wave patterns */}
      <div className="absolute w-full h-full opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-64 bg-blue-500 rounded-full filter blur-[100px] animate-wave-slow"></div>
        <div className="absolute bottom-1/4 right-0 w-full h-64 bg-indigo-700 rounded-full filter blur-[100px] animate-wave-slower"></div>
      </div>
    </div>
  );
};

export default Background;