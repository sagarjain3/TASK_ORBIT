import React, { useState, useEffect } from 'react';
import { X, Search, Plus, UserPlus } from 'lucide-react';
import api from '../api/axiosConfig';

const AddMemberModal = ({ isOpen, onClose, projectId, currentMembers = [], onMemberAdded }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setUsers([]);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(`/users/search?query=${query}&projectId=${projectId}`);
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to search users', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 500);
    return () => clearTimeout(debounce);
  }, [query, currentMembers]);

  if (!isOpen) return null;

  const handleAddMember = async (email) => {
    setActionLoading(true);
    setError('');
    try {
      await api.post(`/projects/${projectId}/members`, { email });
      if (onMemberAdded) onMemberAdded(); 
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.2)] border border-slate-200/60 modal-content overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl">
              <UserPlus className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Add Team Member</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="p-4 mb-6 text-sm font-semibold text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl animate-shake">
              {error}
            </div>
          )}

          <div className="relative mb-8">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email address..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/50 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="min-h-[200px] max-h-[400px] overflow-y-auto custom-scrollbar -mx-2 px-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 gap-4">
                <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Searching Members</p>
              </div>
            ) : users.length > 0 ? (
              <ul className="space-y-3">
                {users.map(user => (
                  <li key={user._id} className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200/50 hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                    <div className="flex items-center gap-4 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-xl shadow-sm object-cover" />
                      ) : (
                        <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl font-bold text-sm shadow-md">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-[15px] font-bold text-slate-900 truncate leading-none mb-1.5">{user.name}</p>
                        <p className="text-[13px] font-medium text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddMember(user.email)}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 group-hover:bg-indigo-500 group-hover:text-white rounded-xl transition-all disabled:opacity-50 interactive-scale"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            ) : query.trim() ? (
              <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-400">No users found matching "{query}"</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                <div className="p-4 bg-indigo-50 rounded-full mb-4">
                  <UserPlus className="w-8 h-8 text-indigo-300" />
                </div>
                <p className="text-sm font-bold text-slate-400">Start typing to find team members</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
