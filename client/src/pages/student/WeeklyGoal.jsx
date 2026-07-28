import React, { useState } from 'react';
import { Target, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { toast } from 'react-toastify';

const pastWeeksHistory = [
  { week: 'Week 1', target: 5.0, achieved: 5.2, met: true },
  { week: 'Week 2', target: 5.0, achieved: 4.8, met: true },
  { week: 'Week 3', target: 5.0, achieved: 6.0, met: true },
  { week: 'Week 4', target: 5.0, achieved: 3.5, met: false },
  { week: 'Current', target: 5.0, achieved: 4.0, met: true },
];

export const WeeklyGoal = () => {
  const [targetHours, setTargetHours] = useState(5.0);
  const currentAchieved = 4.0;
  const percentage = Math.min(Math.round((currentAchieved / targetHours) * 100), 100);

  const handleSaveTarget = () => {
    toast.success(`Weekly study goal updated to ${targetHours} hours/week!`);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="amber" size="sm">STUDY CONSISTENCY</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Weekly Learning Goal
        </h1>
        <p className="text-xs text-gray-500">
          Set a weekly study hours target to maintain your learning pace and unlock bonus XP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Progress Ring & Target Editor */}
        <Card className="p-6 space-y-6 text-center shadow-soft">
          <div className="space-y-1">
            <h3 className="text-sm font-bold font-heading text-gray-900">Current Week Progress</h3>
            <p className="text-xs text-gray-500">{currentAchieved} of {targetHours} hrs completed</p>
          </div>

          {/* SVG Progress Ring */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" className="stroke-amber-100" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-[#F59E0B] transition-all duration-500"
                strokeWidth="8"
                strokeDasharray={263.89}
                strokeDashoffset={263.89 - (percentage / 100) * 263.89}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-mono text-gray-900">{percentage}%</span>
              <span className="text-[10px] font-bold text-amber-800 uppercase font-heading">GOAL</span>
            </div>
          </div>

          {/* Target Slider Editor */}
          <div className="space-y-3 pt-3 border-t border-gray-100 text-left">
            <div className="flex justify-between items-center text-xs font-bold text-gray-700 font-heading">
              <span>Adjust Target Hours</span>
              <span className="font-mono text-[#F59E0B]">{targetHours} hrs/week</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="15.0"
              step="0.5"
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              className="w-full accent-[#F59E0B] cursor-pointer"
            />
            <Button variant="amber" size="sm" fullWidth onClick={handleSaveTarget}>
              Save Target Goal
            </Button>
          </div>
        </Card>

        {/* Right 2 Cols: Past Weeks History */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
              Weekly History & Consistency Log
            </h3>

            <div className="space-y-3">
              {pastWeeksHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-[#F8F9FC] rounded-[8px] border border-gray-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className={`w-5 h-5 ${item.met ? 'text-emerald-500' : 'text-gray-300'}`}
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 font-heading">{item.week}</h4>
                      <p className="text-[11px] text-gray-500">
                        Target: {item.target} hrs • Achieved: <strong className="text-gray-800">{item.achieved} hrs</strong>
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.met ? 'success' : 'neutral'} size="sm">
                    {item.met ? 'GOAL MET' : 'MISSED'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default WeeklyGoal;
