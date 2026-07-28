import React, { useState } from 'react';
import { Video, Calendar, Clock, Plus, Radio, Users, Play, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { MOCK_LIVE_CLASSES } from '../../data/mockData';
import { toast } from 'react-toastify';

export const LiveClassManager = () => {
  const [sessions, setSessions] = useState(MOCK_LIVE_CLASSES);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-08-05');
  const [time, setTime] = useState('14:00');

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSession = {
      id: `live_${Date.now()}`,
      title,
      instructor: 'Dr. Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      status: 'upcoming',
      date: `August 5, 2026`,
      time: `${time} EST`,
      attendees: 0,
      thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=400',
    };

    setSessions([newSession, ...sessions]);
    setTitle('');
    setIsScheduleModalOpen(false);
    toast.success('🎉 Live workshop session scheduled!');
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="amber" size="sm" hasDot>STREAM STUDIO</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Live Stream & Masterclass Manager
          </h1>
          <p className="text-xs text-gray-500">
            Schedule live code-along workshops, launch stream rooms, and archive recordings.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={Plus}
          onClick={() => setIsScheduleModalOpen(true)}
        >
          Schedule Session
        </Button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((item) => (
          <Card key={item.id} className="p-0 overflow-hidden flex flex-col justify-between space-y-0">
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  {item.status === 'live' ? (
                    <Badge variant="danger" size="sm" hasDot className="animate-pulse">
                      LIVE STREAM ACTIVE
                    </Badge>
                  ) : (
                    <Badge variant="amber" size="sm">UPCOMING</Badge>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold font-heading text-gray-900 leading-snug">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#4F46E5]" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    {item.attendees} Registered
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
                onClick={() => toast.info(`Launching stream studio for "${item.title}"`)}
              >
                {item.status === 'live' ? 'Broadcast Live Room' : 'Start Broadcast'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Live Workshop Session"
        size="md"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <Input
            label="Workshop Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Building Real-Time GraphQL Subscriptions with React 19"
            isRequired
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="md" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" leftIcon={CheckCircle2}>
              Confirm & Schedule Session
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default LiveClassManager;
