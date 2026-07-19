import React from 'react';
import { Hexagon } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', withText = true }) => {
  return (
    <Link href="/" className={`flex items-center space-x-2 group ${className}`}>
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-md overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:border-orange-500/50">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-orange-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Hexagon className="w-6 h-6 text-orange-500 group-hover:text-orange-400 transition-colors relative z-10" />
      </div>
      {withText && (
        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-orange-500 via-orange-400 to-blue-600 bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300">
          Codivexa
        </span>
      )}
    </Link>
  );
};
