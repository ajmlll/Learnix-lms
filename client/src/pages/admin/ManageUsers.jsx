import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, UserCheck, Shield, Trash2, ArrowUpRight, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { TableRowSkeleton } from '../../components/common/Skeleton';
import { ADMIN_USERS } from '../../data/mockData';
import { toast } from 'react-toastify';

export const ManageUsers = () => {
  const [users, setUsers] = useState(ADMIN_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === 'all'
        ? true
        : selectedRole === 'suspended'
        ? u.status === 'suspended'
        : u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (id, name, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );
    if (nextStatus === 'suspended') {
      toast.warn(`⚠️ User "${name}" suspended.`);
    } else {
      toast.success(`User "${name}" reactivated.`);
    }
  };

  const handlePromote = (id, name) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: 'instructor' } : u))
    );
    toast.success(`🎉 "${name}" promoted to Faculty Instructor!`);
  };

  const handleDelete = (id, name) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.info(`User "${name}" deleted.`);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="dark" size="sm" hasDot>USER DIRECTORY</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Platform User Management ({users.length})
          </h1>
          <p className="text-xs text-gray-500">
            Search, suspend, promote roles, or audit registered platform members.
          </p>
        </div>

        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={Search}
          className="w-full sm:w-72"
        />
      </div>

      {/* Role Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'student', 'instructor', 'admin', 'suspended'].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] capitalize transition-colors cursor-pointer shrink-0 ${
              selectedRole === role
                ? 'bg-[#4F46E5] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {role} ({role === 'all' ? users.length : role === 'suspended' ? users.filter(u => u.status === 'suspended').length : users.filter(u => u.role === role).length})
          </button>
        ))}
      </div>

      {/* Table / Mobile Stacked Cards */}
      <Card className="p-0 overflow-hidden shadow-soft">
        {isLoading ? (
          <TableRowSkeleton rows={5} />
        ) : filteredUsers.length === 0 ? (
          <div className="p-14 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 font-heading">No Users Found</h3>
            <p className="text-xs text-gray-500">
              No users match your current search or filter. Try adjusting your criteria.
            </p>
            <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setSelectedRole('all'); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
        {/* Desktop View (>=768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#F8F9FC] border-b border-gray-200 text-gray-700 font-heading uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">User Member</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs font-heading">{u.name}</h4>
                        <p className="text-[11px] text-gray-400 font-mono">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.role === 'admin' ? 'dark' : u.role === 'instructor' ? 'amber' : 'primary'} size="sm">
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.status === 'active' ? 'success' : 'danger'} size="sm">
                      {u.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4 font-mono text-gray-500">{u.joinedDate}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {u.role === 'student' && (
                        <button
                          onClick={() => handlePromote(u.id, u.name)}
                          className="px-2 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Promote to Faculty
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleStatus(u.id, u.name, u.status)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                          u.status === 'active'
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (<768px) Stacked Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredUsers.map((u) => (
            <div key={u.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs font-heading">{u.name}</h4>
                    <p className="text-[11px] text-gray-400 font-mono">{u.email}</p>
                  </div>
                </div>
                <Badge variant={u.status === 'active' ? 'success' : 'danger'} size="sm">
                  {u.status.toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <Badge variant={u.role === 'admin' ? 'dark' : u.role === 'instructor' ? 'amber' : 'primary'} size="sm">
                  {u.role.toUpperCase()}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleToggleStatus(u.id, u.name, u.status)}>
                    {u.status === 'active' ? 'Suspend' : 'Activate'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-[#F8F9FC] border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>Showing 1-{filteredUsers.length} of {users.length} Users</span>
          <div className="flex gap-1">
            <button className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-400" disabled aria-label="Previous page">
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-indigo-400" disabled aria-label="Next page">
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
          </>
        )}
      </Card>

    </div>
  );
};

export default ManageUsers;
