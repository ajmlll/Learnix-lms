import React from 'react';
import { Flame } from 'lucide-react';

export const StreakGauge = ({ streakDays = 1, targetDays = 14 }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((streakDays / targetDays) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-gradient-to-b from-amber-50/90 to-amber-100/50 border border-amber-200 rounded-xl p-6 text-center space-y-4 font-sans shadow-soft relative overflow-hidden">
      
      {/* SVG Circular Ring */}
      <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-amber-200/80"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-[#F59E0B] transition-all duration-700 ease-out"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Inner Flame & Counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Flame className="w-8 h-8 text-[#F59E0B] fill-[#F59E0B] animate-bounce" />
          <span className="text-2xl font-extrabold font-mono text-gray-900 leading-none mt-0.5">
            {streakDays}
          </span>
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-heading">
            DAYS
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-bold font-heading text-gray-900">Active Learning Streak</h4>
        <p className="text-xs text-amber-800 font-medium">Keep learning daily to extend your flame!</p>
      </div>

    </div>
  );
};

export default StreakGauge;
