import React from 'react';
import type { ActiveTab, UserRoleMode } from '../../types';
import {
  LayoutDashboard,
  FileText,
  Grid,
  GitCompare,
  UserCheck,
  GraduationCap,
  RefreshCw,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  roleMode: UserRoleMode;
  pendingHitlCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  roleMode,
  pendingHitlCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false
    },
    {
      id: 'documents' as ActiveTab,
      label: 'Policy Documents',
      icon: FileText,
      badge: 'v2.1',
      adminOnly: true
    },
    {
      id: 'matrix' as ActiveTab,
      label: 'Requirement Matrix',
      icon: Grid,
      badge: '10 Roles',
      adminOnly: true
    },
    {
      id: 'pipeline' as ActiveTab,
      label: 'Verification Engine',
      icon: GitCompare,
      badge: 'Core',
      badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
      adminOnly: true
    },
    {
      id: 'hitl' as ActiveTab,
      label: 'Review Queue',
      icon: UserCheck,
      badge: pendingHitlCount > 0 ? `${pendingHitlCount} Flagged` : null,
      badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30 font-medium',
      adminOnly: true
    },
    {
      id: 'learning' as ActiveTab,
      label: 'Employee Portal',
      icon: GraduationCap,
      badge: 'Learner',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      adminOnly: false
    },
    {
      id: 'policy' as ActiveTab,
      label: 'Impact Analyzer',
      icon: RefreshCw,
      badge: 'Simulate',
      adminOnly: true
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Compliance Reports',
      icon: BarChart3,
      badge: 'Export',
      adminOnly: true
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#081729] border-r border-teal-900/30 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-teal-900/30 bg-[#050f1d]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 shrink-0 shadow-md shadow-teal-500/20">
            <Layers className="w-5 h-5 font-bold" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-100">
                SkillSprint
              </span>
              <span className="text-[10px] text-teal-400 font-medium">
                Enterprise Platform
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-800/80 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDimmed = roleMode === 'employee' && item.adminOnly;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 group text-left ${
                isActive
                  ? 'bg-teal-500/15 text-teal-200 font-medium border border-teal-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              } ${isDimmed ? 'opacity-40' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-teal-300'
                }`}
              />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 overflow-hidden">
                  <span className="truncate text-xs font-medium">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md border ${
                        item.badgeColor || 'bg-slate-800/90 text-slate-400 border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Banner (Bottom) */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-xl bg-[#050f1d] border border-teal-900/40">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-200">System Status: Active</span>
          </div>
          <div className="text-[10px] text-slate-400 space-y-0.5">
            <div className="flex justify-between">
              <span>Policy Sync:</span>
              <span className="text-teal-300 font-medium">Up to date</span>
            </div>
            <div className="flex justify-between">
              <span>Verification Engine:</span>
              <span className="text-emerald-400 font-medium">Ready</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 flex justify-center border-t border-teal-900/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
      )}
    </aside>
  );
};

