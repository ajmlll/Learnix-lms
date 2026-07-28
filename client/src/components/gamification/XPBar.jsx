import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

export const XPBar = ({ currentXP = 1450, maxXP = 2000, level = 5, levelTitle = 'Senior Scholar' }) => {
  const percentage = Math.min(Math.round((currentXP / maxXP) * 100), 100);

  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-[12px] p-4 space-y-3 font-sans shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[8px] bg-[#F59E0B] text-white flex items-center justify-center font-extrabold text-xs shadow-sm shadow-amber-300">
            LVL {level}
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 font-heading leading-tight">{levelTitle}</h3>
            <p className="text-[10px] text-amber-700 font-semibold font-mono">Next: Level {level + 1}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-extrabold font-mono text-[#D97706] bg-white px-2.5 py-1 rounded-full border border-amber-200">
          <Zap className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
          <span>{currentXP.toLocaleString()} XP</span>
        </div>
      </div>

      {/* Progress Bar in Amber #F59E0B */}
      <div className="space-y-1">
        <div className="w-full bg-amber-200/60 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-amber-400 to-[#F59E0B] h-full rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono text-amber-800 font-medium">
          <span>{percentage}% to Level {level + 1}</span>
          <span>{currentXP} / {maxXP} XP</span>
        </div>
      </div>
    </div>
  );
};

export default XPBar;
