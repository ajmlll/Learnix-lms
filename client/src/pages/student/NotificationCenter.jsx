import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  MessageSquare,
  Video,
  BookOpen,
  Award,
  Star,
  ExternalLink,
  Filter,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import notificationService from '../../services/notificationService';
import { toast } from 'react-toastify';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'discussion_reply':
      return <MessageSquare className="w-5 h-5 text-indigo-600" />;
    case 'live_class_reminder':
      return <Video className="w-5 h-5 text-purple-600" />;
    case 'course_update':
      return <BookOpen className="w-5 h-5 text-blue-600" />;
    case 'enrollment_success':
      return <Award className="w-5 h-5 text-emerald-600" />;
    case 'certificate_issued':
      return <Award className="w-5 h-5 text-amber-500" />;
    case 'review_reply':
      return <Star className="w-5 h-5 text-amber-500" />;
    default:
      return <Bell className="w-5 h-5 text-[#4F46E5]" />;
  }
};

export const NotificationCenter = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await notificationService.getNotifications({
        page,
        limit: 10,
        isRead: filter === 'unread' ? 'false' : 'all',
      });
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
      setTotalPages(res.pages || 1);
    } catch (err) {
      console.error('[NotificationCenter Fetch Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter, page]);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error('[Mark As Read Error]:', err);
      }
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read.');
    } catch (err) {
      toast.error('Failed to mark all as read.');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.info('Notification removed.');
    } catch (err) {
      toast.error('Failed to delete notification.');
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="space-y-1">
          <Badge variant="primary" size="sm">ACTIVITY UPDATES</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-[#4F46E5]" />
            Notification Center
          </h1>
          <p className="text-xs text-gray-500">
            Stay updated with course announcements, Q&A replies, and live masterclass schedules.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={CheckCheck}
            onClick={handleMarkAllRead}
          >
            Mark all as read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <button
          onClick={() => { setFilter('all'); setPage(1); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[#4F46E5] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => { setFilter('unread'); setPage(1); }}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            filter === 'unread'
              ? 'bg-[#4F46E5] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <span>Unread Only</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-mono">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              hoverable
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 transition-all cursor-pointer border flex items-start gap-4 ${
                !notif.isRead
                  ? 'bg-indigo-50/60 border-indigo-200 shadow-xs'
                  : 'bg-white border-gray-100 opacity-90'
              }`}
            >
              <div className="p-2.5 rounded-full bg-white border border-gray-100 shadow-2xs shrink-0 mt-0.5">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold font-heading ${!notif.isRead ? 'text-indigo-950' : 'text-gray-900'}`}>
                      {notif.title}
                    </h3>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#4F46E5] inline-block" title="Unread" />
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {notif.message}
                </p>

                {notif.link && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4F46E5] pt-1">
                    <span>View details</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>

              <button
                onClick={(e) => handleDelete(e, notif._id)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-xs font-mono text-gray-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <Card className="p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-indigo-50 text-[#4F46E5] flex items-center justify-center mx-auto">
            <Bell className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold font-heading text-gray-900">No Notifications Yet</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              {filter === 'unread'
                ? 'You have caught up with all your unread notifications!'
                : "You don't have any notifications at the moment. Check back later for updates."}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NotificationCenter;
