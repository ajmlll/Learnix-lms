import React, { useState } from 'react';
import { Video, Calendar, Clock, Users, Play, Radio } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { MOCK_LIVE_CLASSES } from '../../data/mockData';
import { toast } from 'react-toastify';

export const LiveClasses = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredClasses =
    activeTab === 'all'
      ? MOCK_LIVE_CLASSES
      : MOCK_LIVE_CLASSES.filter((lc) => lc.status === activeTab);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="amber" size="sm" hasDot>INTERACTIVE LIVE SESSIONS</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Live Workshops & Stream Rooms
        </h1>
        <p className="text-xs text-gray-500">
          Join live code-along masterclasses with instructors and ask questions in real-time.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'all', label: 'All Sessions' },
          { id: 'live', label: 'Live Now' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'recorded', label: 'Past Recorded' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#4F46E5] text-white shadow-xs'
                : 'bg-[#F8F9FC] text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Live Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((item) => (
          <Card hoverable key={item.id} className="p-0 overflow-hidden flex flex-col justify-between space-y-0">
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  {item.status === 'live' ? (
                    <Badge variant="danger" size="sm" hasDot className="animate-pulse">
                      LIVE NOW
                    </Badge>
                  ) : item.status === 'upcoming' ? (
                    <Badge variant="amber" size="sm">UPCOMING</Badge>
                  ) : (
                    <Badge variant="neutral" size="sm">RECORDED</Badge>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold font-heading text-gray-900 leading-snug">
                  {item.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <img src={item.avatar} alt={item.instructor} className="w-6 h-6 rounded-full object-cover" />
                  <span className="font-semibold text-gray-800">{item.instructor}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#4F46E5]" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    {item.attendees} Attending
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F8F9FC] border-t border-gray-100">
              <Button
                variant={item.status === 'live' ? 'danger' : 'primary'}
                size="md"
                fullWidth
                leftIcon={item.status === 'live' ? Radio : Play}
                onClick={() => toast.info(`Connecting to live stream room: ${item.title}`)}
              >
                {item.status === 'live' ? 'Join Live Room' : item.status === 'upcoming' ? 'Set Reminder' : 'Watch Recording'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default LiveClasses;
