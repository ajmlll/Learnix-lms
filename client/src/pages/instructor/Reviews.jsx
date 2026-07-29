import React from 'react';
import { Star, MessageCircle, ThumbsUp } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export const Reviews = () => {
  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="amber" size="sm" hasDot>COURSE FEEDBACK</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Student Reviews & Ratings
        </h1>
        <p className="text-xs text-gray-500">
          Monitor feedback from students across all your published courses.
        </p>
      </div>

      {/* Summary Score Card */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-amber-100/60 border-2 border-amber-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <p className="text-xs font-bold text-amber-800 uppercase font-heading">Overall Faculty Rating</p>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-3xl font-extrabold font-mono text-gray-900">4.9</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-600">Based on 530 course reviews</p>
        </div>

        <div className="flex gap-4 text-center">
          <div className="bg-white p-3 rounded-[8px] border border-amber-200">
            <p className="text-xs text-gray-500 font-medium">5-Star Ratings</p>
            <p className="text-lg font-bold font-mono text-gray-900">92%</p>
          </div>
          <div className="bg-white p-3 rounded-[8px] border border-amber-200">
            <p className="text-xs text-gray-500 font-medium">Positive Sentiment</p>
            <p className="text-lg font-bold font-mono text-emerald-600">98%</p>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {INSTRUCTOR_REVIEWS.map((rev) => (
          <Card key={rev.id} className="p-6 space-y-3 shadow-soft">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img src={rev.avatar} alt={rev.studentName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 font-heading">{rev.studentName}</h4>
                  <p className="text-[11px] text-gray-400">{rev.courseTitle} • {rev.date}</p>
                </div>
              </div>

              <div className="flex text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed italic">"{rev.comment}"</p>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default Reviews;
