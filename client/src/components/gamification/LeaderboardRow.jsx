import React from 'react';
import { Trophy, Zap, Flame, Crown } from 'lucide-react';
import Badge from '../common/Badge';

const rankColors = {
  1: { bg: 'bg-amber-400 text-slate-900 border-amber-300', icon: Crown },
  2: { bg: 'bg-slate-200 text-slate-800 border-slate-300', icon: Trophy },
  3: { bg: 'bg-amber-700 text-white border-amber-800', icon: Trophy },
};

export const LeaderboardRow = ({ student }) => {
  const isPodium = student.rank <= 3;
  const PodiumIcon = rankColors[student.rank]?.icon || Trophy;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[12px] border transition-colors gap-3 ${
        student.isCurrentUser
          ? 'bg-amber-50/80 border-amber-300 shadow-soft'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Rank Badge */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 font-mono ${
            rankColors[student.rank]?.bg || 'bg-gray-100 text-gray-700 border border-gray-200'
          }`}
        >
          {isPodium ? <PodiumIcon className="w-4 h-4" /> : `#${student.rank}`}
        </div>

        {/* Student Avatar & Bio */}
        <img
          src={student.avatar}
          alt={student.name}
          className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
        />

        <div className="space-y-0.5 truncate">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold font-heading text-gray-900 truncate">{student.name}</h4>
            {student.isCurrentUser && <Badge variant="amber" size="sm">YOU</Badge>}
          </div>
          <p className="text-xs text-gray-500 truncate">{student.title} • {student.course}</p>
        </div>
      </div>

      {/* XP & Streak Stats */}
      <div className="flex items-center justify-between sm:justify-end gap-4 text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
        <div className="flex items-center gap-1 text-[#F59E0B] font-medium">
          <Flame className="w-4 h-4 fill-[#F59E0B]" />
          <span>{student.streak}d streak</span>
        </div>

        <div className="flex items-center gap-1 font-mono font-extrabold text-[#D97706] bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
          <Zap className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
          <span>{student.xp.toLocaleString()} XP</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardRow;
