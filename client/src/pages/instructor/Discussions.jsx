import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Filter } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { INSTRUCTOR_DISCUSSIONS } from '../../data/mockData';
import { toast } from 'react-toastify';

export const Discussions = () => {
  const [threads, setThreads] = useState(INSTRUCTOR_DISCUSSIONS);
  const [replyText, setReplyText] = useState({});

  const handlePostReply = (id) => {
    const text = replyText[id];
    if (!text || !text.trim()) return;

    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, replied: true, reply: text } : t))
    );

    setReplyText((prev) => ({ ...prev, [id]: '' }));
    toast.success('Response posted to student thread!');
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="amber" size="sm" hasDot>STUDENT ENGAGEMENT</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Q&A Discussions ({threads.length})
        </h1>
        <p className="text-xs text-gray-500">
          Answer student questions posted in video lectures and foster active learning.
        </p>
      </div>

      {/* Discussion Threads List */}
      <div className="space-y-4">
        {threads.map((disc) => (
          <Card key={disc.id} className="p-6 space-y-4 shadow-soft">
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <img src={disc.avatar} alt={disc.studentName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 font-heading">{disc.studentName}</h4>
                  <p className="text-[11px] text-gray-400">{disc.courseTitle} • {disc.date}</p>
                </div>
              </div>

              <Badge variant={disc.replied ? 'success' : 'amber'} size="sm">
                {disc.replied ? 'REPLIED' : 'UNANSWERED'}
              </Badge>
            </div>

            <div className="bg-[#F8F9FC] p-3.5 rounded-[8px] border border-gray-200 text-xs text-gray-800 space-y-1">
              <span className="font-bold text-[#4F46E5] block">Student Question:</span>
              <p className="leading-relaxed">"{disc.question}"</p>
            </div>

            {/* Instructor Reply Box */}
            {disc.replied ? (
              <div className="bg-amber-50/70 p-3.5 rounded-[8px] border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-900 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Your Response:
                </span>
                <p className="text-amber-800 leading-relaxed">{disc.reply}</p>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <textarea
                  rows={2}
                  placeholder="Type your response to the student..."
                  value={replyText[disc.id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [disc.id]: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-[8px] p-3 text-xs outline-none focus:border-[#4F46E5]"
                />
                <div className="flex justify-end">
                  <Button variant="primary" size="sm" leftIcon={Send} onClick={() => handlePostReply(disc.id)}>
                    Post Reply
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

    </div>
  );
};

export default Discussions;
