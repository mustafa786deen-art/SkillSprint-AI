import { useState } from 'react';
import type {
  ActiveTab,
  UserRoleMode,
  Employee,
  Document,
  MatrixRequirement,
  HitlReviewItem
} from './types';
import {
  MOCK_JOB_ROLES,
  MOCK_EMPLOYEES,
  MOCK_DOCUMENTS,
  MOCK_CHUNKS,
  MOCK_MATRIX_REQUIREMENTS,
  MOCK_DUAL_PIPELINE_RESULT,
  MOCK_HITL_QUEUE,
  MOCK_LEARNING_MODULES,
  MOCK_QUIZ_QUESTIONS,
  MOCK_SCENARIO_TASK,
  MOCK_IMPACT_ANALYSIS,
  MOCK_ANALYTICS_SUMMARY
} from './mockData/mockDatabase';

import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { NotificationCenter } from './components/layout/NotificationCenter';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';
import { DocumentKnowledgeBase } from './components/documents/DocumentKnowledgeBase';
import { RequirementMatrixStudio } from './components/matrix/RequirementMatrixStudio';
import { DualPipelineHub } from './components/pipeline/DualPipelineHub';
import { HitlReviewCenter } from './components/hitl/HitlReviewCenter';
import { EmployeeLearningPortal } from './components/learning/EmployeeLearningPortal';
import { PolicyImpactAnalyzer } from './components/policy/PolicyImpactAnalyzer';
import { AnalyticsReportingHub } from './components/analytics/AnalyticsReportingHub';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [roleMode, setRoleMode] = useState<UserRoleMode>('admin');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Core Mock States
  const [allEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [activeEmployee, setActiveEmployee] = useState<Employee>(MOCK_EMPLOYEES[0]);
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [matrixRequirements, setMatrixRequirements] = useState<MatrixRequirement[]>(MOCK_MATRIX_REQUIREMENTS);
  const [hitlQueue, setHitlQueue] = useState<HitlReviewItem[]>(MOCK_HITL_QUEUE);
  const [pipelineResult] = useState(MOCK_DUAL_PIPELINE_RESULT);

  const handleLogin = (mode: UserRoleMode, employee?: Employee) => {
    setRoleMode(mode);
    if (employee) {
      setActiveEmployee(employee);
      setActiveTab('learning');
    } else {
      setActiveTab('dashboard');
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Handlers for dynamic actions
  const handleAddDocument = (newDoc: Document) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleDeprecateDocument = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'Obsolete' } : d))
    );
  };

  const handleAutoGenerateMatrix = (roleId: string) => {
    const newReq: MatrixRequirement = {
      id: `REQ-${Date.now()}`,
      requirementId: `REQ-AUTO-${Math.floor(10 + Math.random() * 89)}`,
      roleId,
      competencyName: 'Automated SOP Policy Compliance Gate',
      policyMapping: 'SOP-07 §9.2',
      docId: 'DOC-001',
      sectionRef: '§9.2',
      isMandatory: true,
      priority: 'High',
      dueStage: 'Day 1',
      status: 'Mapped'
    };
    setMatrixRequirements((prev) => [...prev, newReq]);
  };

  const handleApproveOverride = (itemId: string, note: string) => {
    setHitlQueue((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              status: 'Approved Override',
              reviewerNotes: note,
              reviewerName: 'Senior HR Compliance Lead',
              updatedAt: new Date().toLocaleTimeString()
            }
          : i
      )
    );
  };

  const handleRejectItem = (itemId: string, note: string) => {
    setHitlQueue((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              status: 'Rejected',
              reviewerNotes: note,
              reviewerName: 'Senior HR Compliance Lead',
              updatedAt: new Date().toLocaleTimeString()
            }
          : i
      )
    );
  };

  const handleEditInline = (itemId: string, editedText: string, note: string) => {
    setHitlQueue((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              genAiOutput: editedText,
              status: 'Approved Override',
              reviewerNotes: note,
              reviewerName: 'Senior HR Compliance Lead',
              updatedAt: new Date().toLocaleTimeString()
            }
          : i
      )
    );
  };

  const handleSelectiveRegenerate = (itemId: string) => {
    setHitlQueue((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              status: 'Selective Regeneration Triggered',
              reviewerNotes: 'Selective micro-regeneration re-executed for chunk',
              updatedAt: new Date().toLocaleTimeString()
            }
          : i
      )
    );
  };

  const pendingHitlCount = hitlQueue.filter((i) => i.status === 'Pending Review').length;

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} allEmployees={allEmployees} />;
  }

  return (
    <div className="min-h-screen bg-[#061325] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        roleMode={roleMode}
        pendingHitlCount={pendingHitlCount}
      />

      {/* Top Header */}
      <Header
        roleMode={roleMode}
        setRoleMode={setRoleMode}
        activeEmployee={activeEmployee}
        setActiveEmployee={setActiveEmployee}
        allEmployees={allEmployees}
        sidebarCollapsed={sidebarCollapsed}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        unreadNotificationsCount={4}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main
        className={`flex-1 transition-all duration-300 pt-20 px-6 pb-12 ${
          sidebarCollapsed ? 'ml-20' : 'ml-72'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            roleMode === 'admin' ? (
              <AdminDashboard
                analytics={MOCK_ANALYTICS_SUMMARY}
                allEmployees={allEmployees}
                pendingHitlCount={pendingHitlCount}
                onNavigateTab={setActiveTab}
                onSelectEmployee={(emp) => {
                  setActiveEmployee(emp);
                  setRoleMode('employee');
                  setActiveTab('learning');
                }}
              />
            ) : (
              <EmployeeDashboard
                employee={activeEmployee}
                modules={MOCK_LEARNING_MODULES}
                dailyQuiz={MOCK_QUIZ_QUESTIONS[0]}
                onNavigateToModule={() => setActiveTab('learning')}
                onNavigateToQuiz={() => setActiveTab('learning')}
              />
            )
          )}

          {/* Document Knowledge Base */}
          {activeTab === 'documents' && (
            <DocumentKnowledgeBase
              documents={documents}
              chunks={MOCK_CHUNKS}
              onAddDocument={handleAddDocument}
              onDeprecateDocument={handleDeprecateDocument}
            />
          )}

          {/* Requirement Matrix Studio */}
          {activeTab === 'matrix' && (
            <RequirementMatrixStudio
              roles={MOCK_JOB_ROLES}
              requirements={matrixRequirements}
              documents={documents}
              onAddRequirement={(req) => setMatrixRequirements((prev) => [...prev, req])}
              onAutoGenerateMatrix={handleAutoGenerateMatrix}
            />
          )}

          {/* Dual Pipeline Hub (Core) */}
          {activeTab === 'pipeline' && (
            <DualPipelineHub
              employees={allEmployees}
              activeEmployee={activeEmployee}
              onSelectEmployee={setActiveEmployee}
              pipelineResult={pipelineResult}
              onNavigateToHitl={() => setActiveTab('hitl')}
              onPublishPlan={() => setActiveTab('learning')}
            />
          )}

          {/* HITL Review Center */}
          {activeTab === 'hitl' && (
            <HitlReviewCenter
              queueItems={hitlQueue}
              onApproveOverride={handleApproveOverride}
              onRejectItem={handleRejectItem}
              onEditInline={handleEditInline}
              onSelectiveRegenerate={handleSelectiveRegenerate}
            />
          )}

          {/* Employee Learning Portal */}
          {activeTab === 'learning' && (
            <EmployeeLearningPortal
              employee={activeEmployee}
              modules={MOCK_LEARNING_MODULES}
              quizzes={MOCK_QUIZ_QUESTIONS}
              scenarioTask={MOCK_SCENARIO_TASK}
              onOpenSourceDoc={() => setActiveTab('documents')}
            />
          )}

          {/* Policy Impact Analyzer */}
          {activeTab === 'policy' && (
            <PolicyImpactAnalyzer
              impactResult={MOCK_IMPACT_ANALYSIS}
              documents={documents}
              onTriggerSelectiveRegen={() => setActiveTab('pipeline')}
            />
          )}

          {/* Analytics & Compliance Reports */}
          {activeTab === 'analytics' && (
            <AnalyticsReportingHub
              analytics={MOCK_ANALYTICS_SUMMARY}
              employees={allEmployees}
            />
          )}

          {/* Enterprise Footer */}
          <footer className="pt-8 pb-4 border-t border-slate-800 text-center text-xs text-slate-500 space-y-1">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">SkillSprint Enterprise v2.4</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Compliance Verified</span>
              <span>•</span>
              <span className="text-slate-400">SOC2 & GDPR Compliant</span>
            </div>
            <p className="text-[11px] text-slate-500">
              © 2026 SkillSprint Enterprise Platform. All rights reserved.
            </p>
          </footer>
        </div>
      </main>

      {/* Notifications Drawer */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigateToHitl={() => setActiveTab('hitl')}
        onNavigateToPolicy={() => setActiveTab('policy')}
      />
    </div>
  );
}

export default App;
