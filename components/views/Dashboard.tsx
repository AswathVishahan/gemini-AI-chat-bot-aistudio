import React from 'react';
import UserCircleIcon from '../icons/UserCircleIcon';
import FolderIcon from '../icons/FolderIcon';
import ChatIcon from '../icons/ChatIcon';

interface DashboardProps {
  setActiveView: (view: 'persona' | 'documents') => void;
  documentsCount?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView, documentsCount = 0 }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-2">Overview of your AI agent's status and quick actions.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Model</span>
              <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-slate-800">Gemini 2.5</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
              </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Knowledge Base</span>
              <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-slate-800">{documentsCount}</span>
                  <span className="text-sm text-slate-500">Documents indexed</span>
              </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Status</span>
              <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-slate-800">Ready</span>
                  <span className="text-sm text-slate-500">Waiting for input</span>
              </div>
          </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Quick Setup</h2>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Step 1 */}
          <div className="p-6 hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setActiveView('persona')}>
            <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <UserCircleIcon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-800">1. Persona</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Define the personality, tone, and system instructions for your agent.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="p-6 hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setActiveView('documents')}>
            <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <FolderIcon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-800">2. Knowledge</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Upload text documents to ground your agent's answers in truth.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="p-6 hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <ChatIcon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-800">3. Test</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Open the widget in the bottom right to talk to your new agent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;