import React from 'react';
import Avatar from './Avatar';

const Header: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full pt-16 pb-10">
      <Avatar />
      <h1 className="mt-8 text-4xl md:text-5xl font-light text-cream-100 tracking-wider">
        Hi, I'm <span className="font-normal text-blue-400">Blues</span>
      </h1>
      <div className="mt-3 text-center">
        <p className="text-lg md:text-xl text-gray-300 font-light">
          Not your regular melomaniac.
        </p>
        <p className="text-lg md:text-xl text-gray-300 mt-1 font-medium">
          Dare me!
        </p>
      </div>
    </div>
  );
};

export default Header;