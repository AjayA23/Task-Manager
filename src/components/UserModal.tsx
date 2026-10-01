import React, { useState } from 'react';
import { X, UserPlus, LogIn, AlertCircle, Mail, User as UserIcon } from 'lucide-react';
import { User } from '../types/index.ts';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: User) => void;
  onLogin: (email: string) => Promise<User>;
  existingUsers: User[];
  onSelectUser: (user: User) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
  onLogin,
  existingUsers,
  onSelectUser,
}) => {
  const [mode, setMode] = useState<'create' | 'login'>('create');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please provide both name and email.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }
      onUserCreated(data);
      onSelectUser(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error creating user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide an email to login.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const user = await onLogin(email.trim());
      onSelectUser(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'User not found. Try creating a new user or select an existing one.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Mode Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMode('create');
                setError(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                mode === 'create'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create User</span>
            </button>

            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Mock Login</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'create' ? (
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Jane Cooper"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., jane@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              {isSubmitting ? 'Creating...' : 'Register User'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter Registered Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., john@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              {isSubmitting ? 'Verifying...' : 'Login with Email'}
            </button>

            {/* Quick 1-click select existing user */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block mb-2">
                Or quick-select existing user:
              </span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {existingUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      onSelectUser(u);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-left transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0"
                        style={{ backgroundColor: u.avatarColor || '#4F46E5' }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-200">{u.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
