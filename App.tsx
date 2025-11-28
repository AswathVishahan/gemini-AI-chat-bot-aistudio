import React, { useState, useEffect } from 'react';
import ChatWidget from './components/ChatWidget';
import Toast from './components/Toast';
import { Document, Message, WidgetPosition } from './types';

// Import view components
import Dashboard from './components/views/Dashboard';
import PersonaSettings from './components/views/PersonaSettings';
import DocumentManager from './components/views/DocumentManager';
import ModelSettings from './components/views/ModelSettings';
import AppearanceSettings from './components/views/AppearanceSettings';
import BehaviorSettings from './components/views/BehaviorSettings';
import Integrations from './components/views/Integrations';

// Import icons
import SparklesIcon from './components/icons/SparklesIcon';
import HomeIcon from './components/icons/HomeIcon';
import UserCircleIcon from './components/icons/UserCircleIcon';
import FolderIcon from './components/icons/FolderIcon';
import PaintBrushIcon from './components/icons/PaintBrushIcon';
import CogIcon from './components/icons/CogIcon';
import LinkIcon from './components/icons/LinkIcon';
import CpuChipIcon from './components/icons/CpuChipIcon';

type View = 'dashboard' | 'persona' | 'documents' | 'model' | 'appearance' | 'behavior' | 'integrations';

interface ToastState {
  id: number;
  message: string;
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [toast, setToast] = useState<ToastState | null>(null);

  // Lifted and new state
  const [messages, setMessages] = useState<Message[]>([]);

  // Persona State
  const [persona, setPersona] = useState('You are a helpful and friendly AI assistant. Be concise and clear in your responses.');
  
  // Document State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocumentName, setActiveDocumentName] = useState<string | null>(null);

  // Appearance Settings
  const [primaryColor, setPrimaryColor] = useState('#3B82F6'); 
  const [widgetPosition, setWidgetPosition] = useState<WidgetPosition>('bottom-right');
  const [headerText, setHeaderText] = useState('Chat Bot');

  // Behavior Settings
  const [welcomeMessage, setWelcomeMessage] = useState("Hello! I'm Chat Bot. How can I help you today?");
  const [enableVoice, setEnableVoice] = useState(true);

  // Model Settings
  const [modelType, setModelType] = useState('flash'); // 'flash' | 'lite'
  const [enableSearch, setEnableSearch] = useState(false);
  const [enableImageGen, setEnableImageGen] = useState(true);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string) => {
    setToast({ id: Date.now(), message });
  };

  const activeDocument = documents.find(doc => doc.name === activeDocumentName);
  const activeDocumentContent = activeDocument ? activeDocument.content : null;
  
  const handleClearConversation = () => {
      setMessages([]);
      showToast('Conversation history cleared.');
  };

  const renderView = () => {
    const commonProps = { showToast };
    switch (activeView) {
      case 'persona':
        return <PersonaSettings persona={persona} setPersona={setPersona} {...commonProps} />;
      case 'documents':
        return <DocumentManager 
                  documents={documents} 
                  setDocuments={setDocuments} 
                  activeDocumentName={activeDocumentName} 
                  setActiveDocumentName={setActiveDocumentName} 
                  {...commonProps}
                />;
      case 'model':
        return <ModelSettings
                  modelType={modelType}
                  setModelType={setModelType}
                  enableSearch={enableSearch}
                  setEnableSearch={setEnableSearch}
                  enableImageGen={enableImageGen}
                  setEnableImageGen={setEnableImageGen}
                  {...commonProps}
               />;
      case 'appearance':
        return <AppearanceSettings 
                  primaryColor={primaryColor}
                  setPrimaryColor={setPrimaryColor}
                  widgetPosition={widgetPosition}
                  setWidgetPosition={setWidgetPosition}
                  headerText={headerText}
                  setHeaderText={setHeaderText}
                  {...commonProps}
               />;
      case 'behavior':
        return <BehaviorSettings 
                  welcomeMessage={welcomeMessage}
                  setWelcomeMessage={setWelcomeMessage}
                  enableVoice={enableVoice}
                  setEnableVoice={setEnableVoice}
                  onClearConversation={handleClearConversation}
                  {...commonProps}
               />;
      case 'integrations':
        return <Integrations />;
      case 'dashboard':
      default:
        return <Dashboard setActiveView={setActiveView} documentsCount={documents.length} />;
    }
  };

  const NavLink: React.FC<{ view: View; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => {
    const isActive = activeView === view;
    return (
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); setActiveView(view); }}
        className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 group ${
            isActive 
            ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <span className={`transition-transform duration-300 ${isActive ? 'scale-110 text-blue-400' : 'group-hover:scale-110'}`}>
            {icon}
        </span>
        <span className="font-medium text-sm tracking-wide">{label}</span>
      </a>
    );
  };

  return (
    <div className="flex h-screen bg-[#0B1120] overflow-hidden font-sans text-slate-300">
      <Toast message={toast?.message} key={toast?.id} />
      
      {/* Modern Dark Sidebar */}
      <aside className="w-72 bg-[#0f172a]/80 backdrop-blur-xl flex flex-col flex-shrink-0 relative z-20 border-r border-white/5">
        <div className="p-6 flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
            <SparklesIcon className="w-6 h-6" />
          </div>
          <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Chat Bot</h2>
              <span className="text-xs text-slate-400 font-medium">AI Agent Builder</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto py-4 custom-scrollbar">
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Overview</h3>
            <div className="space-y-1">
                <NavLink view="dashboard" label="Dashboard" icon={<HomeIcon />} />
            </div>
          </div>
          
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Knowledge & Intelligence</h3>
            <div className="space-y-1">
                <NavLink view="persona" label="Persona" icon={<UserCircleIcon />} />
                <NavLink view="documents" label="Knowledge Base" icon={<FolderIcon />} />
                <NavLink view="model" label="Model & Capabilities" icon={<CpuChipIcon />} />
            </div>
          </div>
          
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Settings</h3>
            <div className="space-y-1">
                <NavLink view="appearance" label="Appearance" icon={<PaintBrushIcon />} />
                <NavLink view="behavior" label="Behavior" icon={<CogIcon />} />
                <NavLink view="integrations" label="Integrations" icon={<LinkIcon />} />
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-slate-50">
        <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth z-10">
          <div className="max-w-6xl mx-auto fade-in">
             {renderView()}
          </div>
        </div>
        
        {/* Chat Widget sits on top of everything */}
        <ChatWidget 
          persona={persona} 
          activeDocumentContent={activeDocumentContent}
          activeDocumentName={activeDocumentName}
          messages={messages}
          setMessages={setMessages}
          primaryColor={primaryColor}
          widgetPosition={widgetPosition}
          headerText={headerText}
          welcomeMessage={welcomeMessage}
          enableVoice={enableVoice}
          modelType={modelType}
          enableSearch={enableSearch}
          enableImageGen={enableImageGen}
        />
      </main>
    </div>
  );
};

export default App;