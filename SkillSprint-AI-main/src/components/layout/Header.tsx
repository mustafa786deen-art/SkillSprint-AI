import React, { useState, useEffect } from 'react';
import type { UserRoleMode, Employee } from '../../types';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  User,
  ChevronDown,
  Check,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  roleMode: UserRoleMode;
  setRoleMode: (mode: UserRoleMode) => void;
  activeEmployee: Employee;
  setActiveEmployee: (employee: Employee) => void;
  allEmployees: Employee[];
  sidebarCollapsed: boolean;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  roleMode,
  setRoleMode,
  activeEmployee,
  setActiveEmployee,
  allEmployees,
  sidebarCollapsed,
  onOpenNotifications,
  unreadNotificationsCount,
  onLogout
}) => {
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#081729]/95 border-b border-teal-900/30 backdrop-blur-md transition-all duration-300 flex items-center justify-between px-6 ${
        sidebarCollapsed ? 'left-20' : 'left-72'
      }`}
    >
      {/* Search Input */}
      <div className="relative w-72 lg:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search documents, policies, roles, employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-12 py-2 text-xs bg-[#050f1d] border border-teal-900/40 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all font-sans"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none">
          {searchQuery ? 'ESC' : '⌘K'}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Toggle */}
        <div className="flex items-center p-1 bg-[#050f1d] border border-teal-900/40 rounded-xl">
          <button
            onClick={() => setRoleMode('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              roleMode === 'admin'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-sm shadow-teal-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin / HR</span>
          </button>
          <button
            onClick={() => setRoleMode('employee')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              roleMode === 'employee'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Learner Portal</span>
          </button>
        </div>

        {/* Active Employee Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#050f1d] border border-teal-900/40 hover:border-teal-500/50 text-xs transition-colors"
          >
            <img
              src={activeEmployee.avatar}
              alt={activeEmployee.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-teal-500/50"
            />
            <div className="text-left hidden sm:block">
              <div className="font-semibold text-slate-200 leading-tight">{activeEmployee.name}</div>
              <div className="text-[10px] text-teal-400">{activeEmployee.roleTitle}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {isEmployeeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#081729] border border-teal-900/50 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-teal-400 uppercase tracking-wider border-b border-teal-900/40">
                Switch Learner Context
              </div>
              {allEmployees.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => {
                    setActiveEmployee(emp);
                    setIsEmployeeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800/80 text-xs transition-colors ${
                    activeEmployee.id === emp.id ? 'bg-teal-500/15 text-teal-300 font-medium' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <div className="font-medium">{emp.name}</div>
                      <div className="text-[10px] text-slate-400">{emp.roleTitle}</div>
                    </div>
                  </div>
                  {activeEmployee.id === emp.id && <Check className="w-4 h-4 text-teal-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-[#050f1d] border border-teal-900/40 text-slate-400 hover:text-teal-300 hover:border-teal-500/40 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-xl bg-[#050f1d] border border-teal-900/40 text-slate-400 hover:text-teal-300 hover:border-teal-500/40 transition-colors"
          title="Toggle Dark / Light Mode"
        >
          {isDarkMode ? <Moon className="w-4 h-4 text-teal-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Sign Out Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-[#050f1d] hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-teal-900/40 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};

