import React from 'react';
import { Award, Flame, Code, Zap, Sun, Users, Lock, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const iconMap = {
  Code,
  Flame,
  Award,
  Zap,
  Sun,
  Users,
};

export const BadgeGrid = ({ badges = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
      {badges.map((badge) => {
        const IconComponent = iconMap[badge.icon] || Award;
        const isUnlocked = badge.isUnlocked;

        return (
          <Card
            key={badge.id}
            hoverable
            className={`p-4 space-y-3 relative transition-all duration-200 ${
              isUnlocked
                ? 'bg-white border-amber-200 shadow-soft'
                : 'bg-gray-50/70 border-gray-200 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-12 h-12 rounded-[12px] flex items-center justify-center border shadow-xs ${
                  isUnlocked
                    ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                    : 'bg-gray-200 text-gray-400 border-gray-300'
                }`}
              >
                <IconComponent className="w-6 h-6" />
              </div>

              {isUnlocked ? (
                <Badge variant="amber" size="sm" hasDot className="gap-1">
                  UNLOCKED
                </Badge>
              ) : (
                <Badge variant="neutral" size="sm" className="gap-1">
                  <Lock className="w-3 h-3" /> LOCKED
                </Badge>
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold font-heading text-gray-900">{badge.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{badge.description}</p>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-mono text-[#D97706] font-bold">+{badge.xpReward} XP</span>
              <span className="text-[11px] text-gray-400 font-mono">
                {isUnlocked ? badge.unlockedDate : badge.progress || 'Locked'}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default BadgeGrid;
