import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Calendar, Sparkles, Clock, Award, ArrowRight } from 'lucide-react';
import StreakGauge from '../../components/gamification/StreakGauge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import gamificationService from '../../services/gamificationService';
import { useAuth } from '../../context/AuthContext';

export const StreakDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [streakData, setStreakData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dynamic streak from API
  const fetchStreak = async () => {
    setIsLoading(true);
    try {
      const data = await gamificationService.getStreak();
      if (data) {
        setStreakData(data);
      }
    } catch (err) {
      console.error('[StreakDashboard Fetch Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStreak();
  }, []);

  // Dynamic Date Computations for Current Month
  const monthCalendarInfo = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const todayNum = now.getDate();

    const monthName = now.toLocaleString('en-US', { month: 'long' });
    const fullFormatted = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Weekday index for Day 1 (0=Sunday -> convert so 0=Monday ... 6=Sunday)
    const firstDayIndex = new Date(year, month, 1).getDay();
    const paddingDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Total days in current month
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    return {
      now,
      year,
      month,
      monthName,
      todayNum,
      paddingDays,
      totalDaysInMonth,
      fullFormatted,
    };
  }, []);

  const streakDays = streakData?.currentStreak ?? user?.streakDays ?? 1;
  const longestStreak = streakData?.longestStreak ?? streakDays;
  const dbActiveDates = streakData?.activeDates || [];

  // Generate GitHub-style Month Days Grid matched against DB activeDates
  const calendarMonthDays = useMemo(() => {
    const { year, month, todayNum, totalDaysInMonth } = monthCalendarInfo;

    return Array.from({ length: totalDaysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(dayNum).padStart(2, '0');
      const dateKey = `${year}-${monthStr}-${dayStr}`;

      const isToday = dayNum === todayNum;
      const isPast = dayNum < todayNum;
      const isFuture = dayNum > todayNum;

      // Active if in DB activeDates array OR inside active current streak window up to today
      const inDB = dbActiveDates.includes(dateKey);
      const inRecentStreak = isPast && (todayNum - dayNum) < streakDays;
      const inTodayStreak = isToday && streakDays > 0;

      const hasStreak = inDB || inRecentStreak || inTodayStreak;

      return {
        dayNum,
        dateKey,
        isToday,
        isPast,
        isFuture,
        hasStreak,
      };
    });
  }, [monthCalendarInfo, dbActiveDates, streakDays]);

  const activeDaysThisMonthCount = useMemo(() => {
    return calendarMonthDays.filter((d) => d.hasStreak).length;
  }, [calendarMonthDays]);

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="space-y-1">
          <Badge variant="amber" size="sm" hasDot>ACTIVITY HEATMAP</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
            Streak Dashboard & Calendar
          </h1>
          <p className="text-xs text-gray-500">
            Real-time GitHub-style learning activity calendar for <strong>{monthCalendarInfo.monthName} {monthCalendarInfo.year}</strong>.
          </p>
        </div>

        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 flex items-center gap-2 self-start sm:self-center">
          <Clock className="w-4 h-4 text-[#F59E0B]" />
          <span>Today: <strong>{monthCalendarInfo.fullFormatted}</strong></span>
        </div>
      </div>

      {/* Today's Streak Banner */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-soft-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                TODAY — {monthCalendarInfo.monthName.toUpperCase()} {monthCalendarInfo.todayNum}, {monthCalendarInfo.year}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
              {streakDays > 0 ? `${streakDays} Day Active Streak Flame 🔥` : 'Start Your Learning Streak Today!'}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Complete a lecture today ({monthCalendarInfo.fullFormatted}) to light up your calendar tile.
            </p>
          </div>

          <Button
            variant="amber"
            size="md"
            rightIcon={ArrowRight}
            onClick={() => navigate('/student/my-learning')}
          >
            Resume Learning Today
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Streak Gauge & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <StreakGauge
              streakDays={streakDays}
              targetDays={Math.max(streakDays + 7, 14)}
            />
          )}

          {/* Quick Stats Card */}
          <Card className="p-5 space-y-4">
            <h4 className="text-xs font-bold text-gray-900 font-heading uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Award className="w-4 h-4 text-[#4F46E5]" />
              Streak Statistics
            </h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-[#F8F9FC] rounded-lg border border-gray-100 space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 font-heading uppercase">Current Streak</span>
                <p className="text-xl font-extrabold font-mono text-amber-500">{streakDays} Days</p>
              </div>
              <div className="p-3 bg-[#F8F9FC] rounded-lg border border-gray-100 space-y-0.5">
                <span className="text-[10px] font-bold text-gray-400 font-heading uppercase">Best Record</span>
                <p className="text-xl font-extrabold font-mono text-indigo-600">{longestStreak} Days</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 2 Cols: GitHub-style Full Month Activity Calendar */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6 shadow-soft">
            
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#F59E0B]" />
                  {monthCalendarInfo.monthName} {monthCalendarInfo.year} Calendar
                </h3>
                <p className="text-xs text-gray-500">
                  {activeDaysThisMonthCount} active streak days recorded in database for this month
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="amber" size="sm" hasDot>
                  {activeDaysThisMonthCount} STREAK DAYS
                </Badge>
              </div>
            </div>

            {/* GitHub-style Full Month Grid (Mon-Sun Headers + Padding + Days) */}
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-2 text-center">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayLabel) => (
                  <span key={dayLabel} className="text-[11px] font-bold text-gray-400 font-heading uppercase py-1">
                    {dayLabel}
                  </span>
                ))}

                {/* Padding cells before Day 1 */}
                {Array.from({ length: monthCalendarInfo.paddingDays }).map((_, idx) => (
                  <div key={`pad-${idx}`} className="h-11 rounded-lg bg-gray-50/30 border border-gray-100/50" />
                ))}

                {/* Days of Current Month */}
                {calendarMonthDays.map((d) => {
                  return (
                    <div
                      key={d.dayNum}
                      className={`h-11 rounded-lg border flex flex-col items-center justify-center text-xs font-mono font-bold transition-all relative group cursor-pointer ${
                        d.hasStreak
                          ? 'bg-[#F59E0B] text-white border-[#F59E0B] shadow-xs hover:scale-105'
                          : d.isToday
                          ? 'bg-indigo-50 text-[#4F46E5] border-[#4F46E5] ring-2 ring-[#4F46E5]'
                          : d.isFuture
                          ? 'bg-[#F8F9FC]/60 text-gray-300 border-gray-100 opacity-60'
                          : 'bg-[#F8F9FC] text-gray-400 border-gray-200'
                      }`}
                      title={
                        d.hasStreak
                          ? `🔥 Active Streak: ${monthCalendarInfo.monthName} ${d.dayNum}`
                          : d.isToday
                          ? `Today (${monthCalendarInfo.monthName} ${d.dayNum})`
                          : `No activity: ${monthCalendarInfo.monthName} ${d.dayNum}`
                      }
                    >
                      {d.hasStreak ? (
                        <Flame className="w-4 h-4 fill-white text-white animate-pulse" />
                      ) : (
                        <span>{d.dayNum}</span>
                      )}

                      {d.isToday && (
                        <span className={`text-[8px] font-sans font-bold uppercase leading-none mt-0.5 ${
                          d.hasStreak ? 'text-amber-100' : 'text-[#4F46E5]'
                        }`}>
                          TODAY
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GitHub-style Heatmap Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#F59E0B] border border-[#F59E0B] inline-block shadow-2xs" />
                  <span className="font-bold text-gray-900">Active Streak Day</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-indigo-50 border border-[#4F46E5] inline-block" />
                  <span className="font-semibold text-gray-800">Today ({monthCalendarInfo.todayNum})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#F8F9FC] border border-gray-200 inline-block" />
                  <span>Greyed (No Streak)</span>
                </span>
              </div>

              <span className="text-[11px] text-gray-400 italic font-mono">
                Live database synced
              </span>
            </div>

          </Card>

          {/* Streak Tips Banner */}
          <Card className="p-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white space-y-2 shadow-soft">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold font-heading">How Streak Calendar Works</h4>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Every day you complete a lecture, your calendar day lights up in orange with a flame icon. Days without activity remain greyed out. Keep your learning habit consistent!
            </p>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default StreakDashboard;
