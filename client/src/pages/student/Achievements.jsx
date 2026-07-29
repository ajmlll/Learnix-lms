import React, { useState } from 'react';
import { Award, Sparkles } from 'lucide-react';
import BadgeGrid from '../../components/gamification/BadgeGrid';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export const Achievements = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredBadges =
    selectedCategory === 'all'
      ? MOCK_ACHIEVEMENTS
      : MOCK_ACHIEVEMENTS.filter((b) => b.category.toLowerCase() === selectedCategory.toLowerCase());

  const unlockedCount = MOCK_ACHIEVEMENTS.filter((b) => b.isUnlocked).length;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="amber" size="sm" hasDot>ACHIEVEMENT HUB</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Badges & Trophies
          </h1>
          <p className="text-xs text-gray-500">
            Unlock achievements by completing milestones, maintaining streaks, and writing code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium">Badges Unlocked</p>
            <p className="text-xl font-extrabold font-mono text-[#F59E0B]">{unlockedCount} / {MOCK_ACHIEVEMENTS.length}</p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'Learning', 'Coding', 'Streak', 'Quizzes', 'Community'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] capitalize transition-colors cursor-pointer shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#F59E0B] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <BadgeGrid badges={filteredBadges} />

    </div>
  );
};

export default Achievements;
