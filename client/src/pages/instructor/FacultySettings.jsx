import React, { useState } from 'react';
import { User, CreditCard, Bell, Shield, Camera, Save, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export const FacultySettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'payout' | 'notifications' | 'security'

  // Profile Form State
  const [name, setName] = useState(user?.name || 'Dr. Elena Rostova');
  const [email, setEmail] = useState(user?.email || 'instructor@learnix.edu');
  const [headline, setHeadline] = useState('Senior Software Architect & Distributed Systems Specialist');
  const [bio, setBio] = useState(
    'Ex-Google Tech Lead with 12+ years of experience building high-scale web systems and mentoring software engineers worldwide.'
  );

  // Payout Form State
  const [payoutMethod, setPayoutMethod] = useState('bank');
  const [bankName, setBankName] = useState('JPMorgan Chase & Co.');
  const [accountNumber, setAccountNumber] = useState('**** **** 4211');
  const [routingNumber, setRoutingNumber] = useState('021000021');

  // Notification Preferences
  const [notifyEnrollment, setNotifyEnrollment] = useState(true);
  const [notifyDiscussions, setNotifyDiscussions] = useState(true);
  const [notifyReviews, setNotifyReviews] = useState(true);
  const [notifyPayouts, setNotifyPayouts] = useState(true);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);
    toast.success('🎉 Faculty profile & payout settings updated!');
  };

  return (
    <div className="py-6 space-y-8 font-sans max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="amber" size="sm" hasDot>FACULTY PREFERENCES</Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
          Faculty Account Settings
        </h1>
        <p className="text-xs text-gray-500">
          Manage your instructor public profile, payout accounts, notification alerts, and security.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        {[
          { id: 'profile', label: 'Public Profile', icon: User },
          { id: 'payout', label: 'Payout Details', icon: CreditCard },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security & Password', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-[8px] transition-colors cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'bg-[#F8F9FC] text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile Settings */}
      {activeTab === 'profile' && (
        <Card className="p-6 space-y-6 shadow-soft">
          <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
            Instructor Public Profile
          </h2>

          {/* Avatar Upload Preview */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'}
                alt={name}
                className="w-20 h-20 rounded-full object-cover border-2 border-amber-300 shadow-sm"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 p-1.5 bg-[#4F46E5] text-white rounded-full hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 font-heading">{name}</h3>
              <p className="text-xs text-amber-700 font-semibold font-mono">Senior Faculty Member</p>
              <p className="text-[11px] text-gray-400">JPG, PNG or WEBP up to 2MB</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name & Academic Title"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isRequired
              />
              <Input
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
              />
            </div>

            <Input
              label="Professional Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Software Architect & Open Source Contributor"
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">
                Instructor Biography
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-[8px] p-3 text-xs outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button type="submit" variant="primary" size="md" isLoading={isSaving} leftIcon={Save}>
                Save Profile Settings
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Payout Details */}
      {activeTab === 'payout' && (
        <Card className="p-6 space-y-6 shadow-soft">
          <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
            Direct Deposit Payout Account
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 font-heading">
                Payment Distribution Method
              </label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-gray-200 rounded-[8px] p-2.5 outline-none"
              >
                <option value="bank">Direct Deposit ACH (US Bank Account)</option>
                <option value="paypal">PayPal Electronic Transfer</option>
                <option value="wire">International Wire Transfer (SWIFT)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
              <Input
                label="Routing ABA Number"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
              />
            </div>

            <Input
              label="Account Number / IBAN"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button type="submit" variant="amber" size="md" isLoading={isSaving} leftIcon={Save}>
                Save Payout Account
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 3: Notification Preferences */}
      {activeTab === 'notifications' && (
        <Card className="p-6 space-y-6 shadow-soft">
          <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
            Notification Alert Preferences
          </h2>

          <div className="space-y-4">
            {[
              { title: 'New Course Enrollments', desc: 'Receive instant email alert when a student purchases your course.', state: notifyEnrollment, setState: setNotifyEnrollment },
              { title: 'Student Q&A Discussion Posts', desc: 'Get notified when students post questions in video lectures.', state: notifyDiscussions, setState: setNotifyDiscussions },
              { title: 'Course Reviews & Ratings', desc: 'Notification when a new review is posted on your course.', state: notifyReviews, setState: setNotifyReviews },
              { title: 'Monthly Revenue & Payout Confirmations', desc: 'Receive receipt when direct deposit transfer completes.', state: notifyPayouts, setState: setNotifyPayouts },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#F8F9FC] rounded-[8px] border border-gray-200">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-gray-900 font-heading">{item.title}</h4>
                  <p className="text-[11px] text-gray-500">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={item.state}
                  onChange={(e) => item.setState(e.target.checked)}
                  className="w-4 h-4 accent-[#4F46E5] cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button variant="primary" size="md" onClick={handleSaveProfile} leftIcon={Save}>
              Save Alert Preferences
            </Button>
          </div>
        </Card>
      )}

      {/* Tab 4: Security & Password */}
      {activeTab === 'security' && (
        <Card className="p-6 space-y-6 shadow-soft">
          <h2 className="text-base font-bold font-heading text-gray-900 border-b border-gray-100 pb-2">
            Security & Password Manager
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button type="submit" variant="primary" size="md" leftIcon={Save}>
                Update Security Password
              </Button>
            </div>
          </form>
        </Card>
      )}

    </div>
  );
};

export default FacultySettings;
