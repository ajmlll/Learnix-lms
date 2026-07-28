import React, { useState } from 'react';
import { User, Mail, Lock, Camera, Save, ShieldCheck, Bell, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';

export const Profile = () => {
  const { user, setUser } = useAuth();

  // Profile Form state
  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [email, setEmail] = useState(user?.email || 'alex@learnix.edu');
  const [title, setTitle] = useState(user?.title || 'Computer Science Scholar');
  const [bio, setBio] = useState('Passionate about full-stack engineering, AI agents, and clean system architecture.');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setUser({ ...user, name, email, title });
    setIsUpdatingProfile(false);
    toast.success('🎉 Profile information updated successfully!');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsUpdatingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('🔒 Security password changed successfully!');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#4F46E5]"
            />
            <button
              onClick={() => toast.info('Avatar image selection dialog opened.')}
              className="absolute bottom-0 right-0 p-1.5 bg-[#4F46E5] text-white rounded-full shadow-md hover:bg-[#4338CA] transition-colors cursor-pointer"
              title="Change Avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-heading text-gray-900">{name}</h1>
              <Badge variant="primary" size="sm">STUDENT</Badge>
            </div>
            <p className="text-xs text-gray-500">{email}</p>
            <p className="text-[11px] text-[#4F46E5] font-semibold mt-0.5">{title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-amber-50 border border-amber-100 text-[#D97706] px-3 py-1.5 rounded-full font-bold">
          <Sparkles className="w-4 h-4 fill-[#F59E0B]" />
          <span>{user?.xpPoints || 1450} XP • Rank #12</span>
        </div>
      </div>

      {/* Main Grid: Profile Info & Security Password */}
      <div className="space-y-6">
        
        {/* Personal Details Form */}
        <Card className="p-6 space-y-6 shadow-soft">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-gray-900">Personal Information</h2>
              <p className="text-xs text-gray-500">Update your public profile details</p>
            </div>
            <User className="w-5 h-5 text-[#4F46E5]" />
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={User}
                isRequired
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={Mail}
                isRequired
              />
            </div>

            <Input
              label="Professional Headline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Computer Science Scholar / Full-Stack Engineer"
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-heading">
                Bio / About Me
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white text-gray-900 placeholder-gray-400 text-sm rounded-[8px] border border-gray-200 p-3 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="md" isLoading={isUpdatingProfile} leftIcon={Save}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password Form */}
        <Card className="p-6 space-y-6 shadow-soft">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-gray-900">Security & Password</h2>
              <p className="text-xs text-gray-500">Manage password and security authentication</p>
            </div>
            <Lock className="w-5 h-5 text-amber-500" />
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
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
                placeholder="Min 6 characters"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="secondary" size="md" isLoading={isUpdatingPassword} leftIcon={ShieldCheck}>
                Update Security Password
              </Button>
            </div>
          </form>
        </Card>

      </div>

    </div>
  );
};

export default Profile;
