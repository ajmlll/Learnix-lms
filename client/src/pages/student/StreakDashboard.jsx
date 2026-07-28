import React, { useState } from 'react';
import { Flame, ShieldCheck, Calendar, Sparkles, Check } from 'lucide-react';
import StreakGauge from '../../components/gamification/StreakGauge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { toast } from 'react-toastify';

export const StreakDashboard = () => {
  const [shieldsCount, setShieldsCount] = useState(2);

  const handleUseShield = () => {
    if (shieldsCount > 0) {
      setShieldsCount((prev) => prev - 1);
      toast.success('🛡️ Streak Freeze Shield activated for 24 hours!');
    } else {
      toast.error('No Streak Freeze Shields remaining.');
    }
  };

  // Days in current month for heatmap
  const daysInJuly = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    active: i + 1 >= 21 && i + 1 <= 28, // 7-day streak mock
  }));

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="amber" size="sm" hasDot>GAMIFICATION STREAK HUB</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Streak Dashboard & Heatmap
        </h1>
        <p className="text-xs text-gray-500">
          Learn every day to keep your flame burning and earn streak multiplier rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Streak Gauge */}
        <div className="lg:col-span-1 space-y-6">
          <StreakGauge streakDays={7} targetDays={14} shieldsCount={shieldsCount} />

          <Card className="p-5 space-y-3 bg-amber-50/50 border-amber-200">
            <h4 className="text-xs font-bold text-gray-900 font-heading flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Streak Freeze Inventory
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Streak shields protect your learning flame if you miss a day due to travel or busy schedule.
            </p>
            <Button
              variant="amber"
              size="sm"
              fullWidth
              isDisabled={shieldsCount === 0}
              onClick={handleUseShield}
            >
              Use Streak Freeze Shield ({shieldsCount} left)
            </Button>
          </Card>
        </div>

        {/* Right 2 Cols: Monthly Calendar Heatmap */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#F59E0B]" />
                  July 2026 Streak Heatmap
                </h3>
                <p className="text-xs text-gray-500">7 active streak days recorded this month</p>
              </div>
              <Badge variant="amber" size="sm">ACTIVE FLAME</Badge>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <span key={d} className="text-[11px] font-bold text-gray-400 font-heading">
                  {d}
                </span>
              ))}

              {/* Day Cells */}
              {daysInJuly.map((d) => (
                <div
                  key={d.day}
                  className={`h-10 rounded-[8px] border flex items-center justify-center text-xs font-mono font-bold transition-all ${
                    d.active
                      ? 'bg-[#F59E0B] text-white border-[#F59E0B] shadow-xs'
                      : 'bg-[#F8F9FC] text-gray-500 border-gray-200'
                  }`}
                >
                  {d.active ? <Flame className="w-4 h-4 fill-white" /> : d.day}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#F59E0B]" /> Active Streak Day
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-gray-200" /> Inactive Day
              </span>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default StreakDashboard;
