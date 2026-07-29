import React, { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getAllUsers({
        role: selectedRole !== 'all' && selectedRole !== 'suspended' ? selectedRole : undefined,
        search: searchTerm || undefined,
      });
      setUsers(res.data || res.users || []);
    } catch (err) {
      console.error('[ManageUsers API Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, selectedRole]);

  const filteredUsers = users.filter((u) => {
    const roleMatch = selectedRole === 'all' || (selectedRole === 'suspended' ? u.status === 'suspended' : u.role === selectedRole);
    const searchMatch = !searchTerm || (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return roleMatch && searchMatch;
  });

  const handleToggleStatus = async (id, name, currentStatus) => {
    try {
      await adminService.suspendUser(id);
      toast.warn(`User status updated for ${name}.`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const handlePromote = async (id, name) => {
    try {
      await adminService.promoteUser(id, 'instructor');
      toast.success(`User "${name}" promoted to Faculty/Instructor!`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to promote user');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="dark" size="sm" hasDot>USER ACCESS DIRECTORY</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Platform Accounts ({users.length})
          </h1>
          <p className="text-xs text-gray-500">
            View registered students, faculty members, and administrative staff accounts.
          </p>
        </div>
      </div>

      {/* Controls: Search & Role Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[12px] border border-gray-200 shadow-soft">
        
        {/* Role Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {['all', 'student', 'instructor', 'admin', 'suspended'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-colors cursor-pointer capitalize shrink-0 ${
                selectedRole === role
                  ? 'bg-[#4F46E5] text-white shadow-xs'
                  : 'bg-[#F8F9FC] text-gray-600 hover:bg-gray-100'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F8F9FC] border border-gray-200 rounded-[8px] focus:bg-white focus:border-[#4F46E5] outline-none"
          />
        </div>
      </div>

      {/* Users Table / Mobile Cards */}
      <Card className="p-0 overflow-hidden shadow-soft">
        {isLoading ? (
          <TableRowSkeleton rows={5} />
        ) : filteredUsers.length === 0 ? (
          <div className="p-14 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 font-heading">No Accounts Found</h3>
            <p className="text-xs text-gray-500">No users match your current search and role filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop View (>=768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-[#F8F9FC] border-b border-gray-200 text-gray-700 font-heading font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredUsers.map((u) => {
                    const userId = u._id || u.id;
                    const uRole = u.role || 'student';
                    const uStatus = u.status || 'active';
                    return (
                      <tr key={userId} className="hover:bg-gray-50/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-[#4F46E5] font-bold flex items-center justify-center text-xs">
                              {(u.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-xs font-heading">{u.name || 'User'}</h4>
                              <p className="text-[11px] text-gray-400 font-mono">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={uRole === 'admin' ? 'dark' : uRole === 'instructor' ? 'amber' : 'primary'} size="sm">
                            {uRole.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={uStatus === 'active' ? 'success' : 'danger'} size="sm">
                            {uStatus.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 font-mono text-gray-500">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {uRole === 'student' && (
                              <button
                                onClick={() => handlePromote(userId, u.name)}
                                className="px-2 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Promote to Faculty
                              </button>
                            )}
                            {uRole !== 'admin' && (
                              <button
                                onClick={() => handleToggleStatus(userId, u.name, uStatus)}
                                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                                  uStatus === 'active'
                                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                {uStatus === 'active' ? 'Suspend' : 'Reactivate'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View (<768px) Stacked Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredUsers.map((u) => {
                const userId = u._id || u.id;
                const uRole = u.role || 'student';
                const uStatus = u.status || 'active';
                return (
                  <div key={userId} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-[#4F46E5] font-bold flex items-center justify-center text-xs">
                          {(u.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs font-heading">{u.name || 'User'}</h4>
                          <p className="text-[11px] text-gray-400 font-mono">{u.email}</p>
                        </div>
                      </div>
                      <Badge variant={uStatus === 'active' ? 'success' : 'danger'} size="sm">
                        {uStatus.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                      <Badge variant={uRole === 'admin' ? 'dark' : uRole === 'instructor' ? 'amber' : 'primary'} size="sm">
                        {uRole.toUpperCase()}
                      </Badge>
                      {uRole !== 'admin' && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleToggleStatus(userId, u.name, uStatus)}>
                            {uStatus === 'active' ? 'Suspend' : 'Activate'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

    </div>
  );
};

export default ManageUsers;
