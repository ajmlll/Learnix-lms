import React, { useState, useEffect } from 'react';
import { Target, Clock, CheckCircle2, TrendingUp, Save, Sparkles, Loader2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import gamificationService from '../../services/gamificationService';
import { toast } from 'react-toastify';

export const WeeklyGoal = () => {
  const [targetHours, setTargetHours] = useState(2.5); // Default 150 mins = 2.5 hrs
  const [completedMinutes, setCompletedMinutes] = useState(0);
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user weekly goal and real database history
  const fetchGoal = async () => {
    setIsLoading(true);
    try {
      const res = await gamificationService.getWeeklyGoal();
      const goal = res.data;
      const history = res.history || [];

      if (goal) {
        if (goal.targetMinutes) {
          setTargetHours(Math.round((goal.targetMinutes / 60) * 10) / 10);
        }
        if (goal.completedMinutes !== undefined) {
          setCompletedMinutes(goal.completedMinutes);
        }
      }

      setHistoryList(history);
    } catch (err) {
      console.error('[WeeklyGoal Fetch Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, []);

  const currentAchievedHours = Math.round((completedMinutes / 60) * 10) / 10;
  const percentage = Math.min(Math.round((currentAchievedHours / Math.max(0.5, targetHours)) * 100), 100);

  const handleSaveTarget = async () => {
    setIsSaving(true);
    try {
      const targetMins = Math.round(targetHours * 60);
      await gamificationService.setWeeklyGoal(targetMins);
      toast.success(`🎯 Weekly goal updated to ${targetHours} hrs (${targetMins} mins/week)!`);
      fetchGoal();
    } catch (err) {
      console.error('[WeeklyGoal Save Error]:', err);
      toast.error(err.response?.data?.message || 'Failed to save weekly target goal.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1 border-b border-gray-200 pb-4">
        <Badge variant="amber" size="sm" hasDot>STUDY CONSISTENCY</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Weekly Learning Goal
        </h1>
        <p className="text-xs text-gray-500">
          Set your personal weekly study hours target to build habit consistency and monitor progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Progress Ring & Target Editor */}
        <Card className="p-6 space-y-6 text-center shadow-soft">
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <>
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-heading text-gray-900">Current Week Progress</h3>
                <p className="text-xs text-gray-500 font-mono">
                  {currentAchievedHours} of {targetHours} hrs completed
                </p>
              </div>

              {/* SVG Progress Ring */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="stroke-amber-100" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="stroke-[#F59E0B] transition-all duration-700 ease-out"
                    strokeWidth="8"
                    strokeDasharray={263.89}
                    strokeDashoffset={263.89 - (percentage / 100) * 263.89}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold font-mono text-gray-900">{percentage}%</span>
                  <span className="text-[10px] font-bold text-amber-800 uppercase font-heading tracking-wider">
                    TARGET
                  </span>
                </div>
              </div>

              {/* Target Slider Editor */}
              <div className="space-y-3 pt-3 border-t border-gray-100 text-left">
                <div className="flex justify-between items-center text-xs font-bold text-gray-700 font-heading">
                  <span>Set Goal Target</span>
                  <span className="font-mono text-[#F59E0B] font-extrabold">{targetHours} hrs/week</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20.0"
                  step="0.5"
                  value={targetHours}
                  onChange={(e) => setTargetHours(Number(e.target.value))}
                  className="w-full accent-[#F59E0B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>30 mins (0.5h)</span>
                  <span>20 hrs/wk</span>
                </div>

                <Button
                  variant="amber"
                  size="sm"
                  fullWidth
                  leftIcon={Save}
                  isLoading={isSaving}
                  onClick={handleSaveTarget}
                >
                  Save Target Goal
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Right 2 Cols: Real Database History Log */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4 shadow-soft">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
                Weekly History Log
              </h3>
              <Badge variant="amber" size="sm">DATABASE RECORDS</Badge>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
              </div>
            ) : historyList.length > 0 ? (
              <div className="space-y-3">
                {historyList.map((item, idx) => {
                  const targetH = Math.round(((item.targetMinutes || 150) / 60) * 10) / 10;
                  const achievedH = Math.round(((item.completedMinutes || 0) / 60) * 10) / 10;
                  const isMet = achievedH >= targetH;
                  const weekDateStr = item.weekStartDate
                    ? new Date(item.weekStartDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Current Week';

                  return (
                    <div
                      key={item._id || idx}
                      className="flex items-center justify-between p-3.5 bg-[#F8F9FC] rounded-lg border border-gray-200 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2
                          className={`w-5 h-5 ${isMet ? 'text-emerald-500' : 'text-[#F59E0B]'}`}
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 font-heading">
                            {idx === 0 ? 'Current Week Goal' : `Week of ${weekDateStr}`}
                          </h4>
                          <p className="text-[11px] text-gray-500 font-mono">
                            Target: {targetH} hrs • Achieved: <strong className="text-gray-800">{achievedH} hrs</strong>
                          </p>
                        </div>
                      </div>
                      <Badge variant={isMet ? 'success' : 'amber'} size="sm">
                        {isMet ? 'GOAL MET' : 'IN PROGRESS'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-500">
                No past weekly records found in database.
              </div>
            )}
          </Card>

          <Card className="p-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white space-y-2 shadow-soft">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 fill-white" />
              <h4 className="text-sm font-bold font-heading">Study Consistency Tip</h4>
            </div>
            <p className="text-xs leading-relaxed opacity-95">
              Setting realistic weekly goals (e.g. 2.5 to 5 hours per week) helps maintain a 100% completion rate without burnout.
            </p>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default WeeklyGoal;
