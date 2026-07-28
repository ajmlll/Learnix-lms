import React from 'react';
import { Zap, Sparkles, Trophy, Flame, History, Award } from 'lucide-react';
import XPBar from '../../components/gamification/XPBar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { MOCK_XP_HISTORY } from '../../data/mockData';

export const XPDashboard = () => {
  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white p-6 sm:p-8 rounded-[16px] shadow-soft-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <Badge variant="dark" size="sm">GAMIFICATION HUB</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            XP & Level Progression
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
            Earn Experience Points (XP) by completing lessons, scoring high on AI quizzes, and maintaining daily learning streaks.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-[12px] border border-white/20 text-center z-10 shrink-0">
          <p className="text-xs text-amber-100 font-medium">Global Ranking</p>
          <p className="text-2xl font-extrabold font-mono text-white">Rank #3</p>
          <span className="text-[10px] text-amber-200 font-mono">Top 2% Students</span>
        </div>

        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Grid: XPBar & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: XP Level Bar & Rewards Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          <XPBar currentXP={1450} maxXP={2000} level={5} levelTitle="Senior Scholar" />

          {/* Level Unlock Roadmap */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold font-heading text-gray-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#F59E0B]" />
              Level Progression Perks
            </h3>

            <div className="space-y-3">
              {[
                { level: 5, title: 'Senior Scholar', req: '1,450 XP', unlocked: true, perk: 'Unlocked Custom Code Playground themes & AI summary tools' },
                { level: 6, title: 'Master Architect', req: '2,000 XP', unlocked: false, perk: 'Unlocks 1-on-1 Instructor Q&A Priority & Gold Profile Badge' },
                { level: 7, title: 'Legendary Fellow', req: '3,500 XP', unlocked: false, perk: 'Exclusive access to Private Live Masterclasses' },
              ].map((lvl) => (
                <div
                  key={lvl.level}
                  className={`p-3.5 rounded-[8px] border text-xs flex items-center justify-between gap-3 ${
                    lvl.unlocked ? 'bg-amber-50/70 border-amber-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        lvl.unlocked ? 'bg-[#F59E0B] text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      L{lvl.level}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{lvl.title}</h4>
                      <p className="text-[11px] text-gray-500">{lvl.perk}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-700 shrink-0">{lvl.req}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: XP History Log */}
        <div>
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold font-heading text-gray-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#F59E0B]" />
                Recent XP Activity Log
              </h3>
              <Badge variant="amber" size="sm">5 LOGS</Badge>
            </div>

            <div className="space-y-3">
              {MOCK_XP_HISTORY.map((log) => (
                <div key={log.id} className="p-3 bg-[#F8F9FC] rounded-[8px] border border-gray-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900">{log.action}</span>
                    <span className="font-mono text-xs font-extrabold text-[#D97706]">+{log.xp} XP</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>Category: {log.category}</span>
                    <span>{log.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default XPDashboard;
