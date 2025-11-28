import React, { useState, useEffect } from 'react';

interface BehaviorSettingsProps {
    welcomeMessage: string;
    setWelcomeMessage: (message: string) => void;
    enableVoice: boolean;
    setEnableVoice: (enabled: boolean) => void;
    onClearConversation: () => void;
    showToast: (message: string) => void;
}

const DEFAULTS = {
    welcomeMessage: "Hello! I'm Chat Bot. How can I help you today?",
    enableVoice: true,
}

const BehaviorSettings: React.FC<BehaviorSettingsProps> = ({
    welcomeMessage,
    setWelcomeMessage,
    enableVoice,
    setEnableVoice,
    onClearConversation,
    showToast,
}) => {
    const [message, setMessage] = useState(welcomeMessage);
    const [voice, setVoice] = useState(enableVoice);

    useEffect(() => {
        setMessage(welcomeMessage);
        setVoice(enableVoice);
    }, [welcomeMessage, enableVoice]);
    
    const isChanged = message !== welcomeMessage || voice !== enableVoice;

    const handleSave = () => {
        setWelcomeMessage(message);
        setEnableVoice(voice);
        showToast('Behavior settings saved!');
    };
    
    const handleReset = () => {
        setMessage(DEFAULTS.welcomeMessage);
        setVoice(DEFAULTS.enableVoice);
    }
    
    const handleClear = () => {
        if (window.confirm('Are you sure you want to clear the entire chat history? This cannot be undone.')) {
            onClearConversation();
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Behavior</h1>
                <p className="text-slate-500 mt-1">Configure how the bot interacts and responds.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
                {/* Welcome Message */}
                <div>
                    <label htmlFor="welcome-message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Welcome Message
                    </label>
                    <textarea
                        id="welcome-message"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 transition-all text-sm"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                     <p className="mt-2 text-xs text-gray-400">The first message users see. Make it inviting!</p>
                </div>

                {/* Enable Voice Output */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">Voice Response</span>
                        <span className="text-xs text-gray-500 mt-1">Automatically read bot responses aloud.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={voice} onChange={() => setVoice(!voice)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="border-t border-gray-100 pt-6">
                     <h3 className="text-sm font-bold text-red-600 mb-4">Danger Zone</h3>
                     <div className="p-5 border border-red-100 bg-red-50/50 rounded-xl flex items-center justify-between">
                         <div>
                             <p className="font-semibold text-gray-800 text-sm">Clear History</p>
                             <p className="text-xs text-red-500 mt-1">Permanently remove all chat messages.</p>
                         </div>
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 bg-white text-red-600 border border-red-200 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Clear Data
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Reset Defaults
                </button>
                <button
                    onClick={handleSave}
                    className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all"
                    disabled={!isChanged}
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default BehaviorSettings;