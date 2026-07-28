import React, { useState } from 'react';
import { Trophy, Crown, Zap, Flame, Award } from 'lucide-react';
import LeaderboardRow from '../../components/gamification/LeaderboardRow';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { MOCK_LEADERBOARD } from '../../data/mockData';

export const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('global'); // 'global' | 'course'

  const topThree = MOCK_LEADERBOARD.slice(0, 3);
  const remainingStudents = MOCK_LEADERBOARD;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="amber" size="sm" hasDot>LEADERBOARD RANKINGS</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Global Student Rankings
        </h1>
        <p className="text-xs text-gray-500">
          Rankings update daily based on XP points earned from course completions, quizzes, and streaks.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('global')}
          className={`px-4 py-2 text-xs font-bold rounded-[8px] transition-colors cursor-pointer ${
            activeTab === 'global' ? 'bg-[#F59E0B] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Global Top Learners
        </button>
        <button
          onClick={() => setActiveTab('course')}
          className={`px-4 py-2 text-xs font-bold rounded-[8px] transition-colors cursor-pointer ${
            activeTab === 'course' ? 'bg-[#F59E0B] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          MERN Architecture Course Leaderboard
        </button>
      </div>

      {/* Podium Cards Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* 2nd Place */}
        <Card className="p-5 text-center space-y-3 bg-slate-50 border-slate-300 order-2 md:order-1">
          <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold font-mono mx-auto">
            #2
          </div>
          <img src={topThree[1]?.avatar} alt={topThree[1]?.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-300 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-gray-900 font-heading">{topThree[1]?.name}</h3>
            <p className="text-xs text-gray-500">{topThree[1]?.title}</p>
          </div>
          <Badge variant="neutral" size="sm">{topThree[1]?.xp} XP</Badge>
        </Card>

        {/* 1st Place Gold */}
        <Card className="p-6 text-center space-y-3 bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-amber-400 shadow-soft-lg order-1 md:order-2 transform md:-translate-y-2">
          <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold mx-auto shadow-md">
            <Crown className="w-8 h-8 fill-slate-900" />
          </div>
          <img src={topThree[0]?.avatar} alt={topThree[0]?.name} className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 mx-auto" />
          <div>
            <Badge variant="amber" size="sm" className="mb-1">1st PLACE CHAMPION</Badge>
            <h3 className="text-base font-extrabold text-gray-900 font-heading">{topThree[0]?.name}</h3>
            <p className="text-xs text-amber-800 font-semibold">{topThree[0]?.title}</p>
          </div>
          <div className="text-lg font-extrabold font-mono text-[#D97706]">{topThree[0]?.xp} XP</div>
        </Card>

        {/* 3rd Place */}
        <Card className="p-5 text-center space-y-3 bg-amber-50/40 border-amber-200 order-3">
          <div className="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold font-mono mx-auto">
            #3
          </div>
          <img src={topThree[2]?.avatar} alt={topThree[2]?.name} className="w-16 h-16 rounded-full object-cover border-2 border-amber-700 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-gray-900 font-heading">{topThree[2]?.name}</h3>
            <p className="text-xs text-gray-500">{topThree[2]?.title}</p>
          </div>
          <Badge variant="amber" size="sm">{topThree[2]?.xp} XP</Badge>
        </Card>
      </div>

      {/* Full Leaderboard Roster Table */}
      <div className="space-y-3 pt-4">
        <h3 className="text-base font-bold font-heading text-gray-900">Ranked Roster</h3>
        {remainingStudents.map((s) => (
          <LeaderboardRow key={s.rank} student={s} />
        ))}
      </div>

    </div>
  );
};

export default Leaderboard;
