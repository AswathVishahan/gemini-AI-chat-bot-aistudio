import React, { useState } from 'react';

interface ModelSettingsProps {
    modelType: string;
    setModelType: (type: string) => void;
    enableSearch: boolean;
    setEnableSearch: (enable: boolean) => void;
    enableImageGen: boolean;
    setEnableImageGen: (enable: boolean) => void;
    showToast: (message: string) => void;
}

const ModelSettings: React.FC<ModelSettingsProps> = ({ 
    modelType, 
    setModelType, 
    enableSearch, 
    setEnableSearch, 
    enableImageGen,
    setEnableImageGen,
    showToast 
}) => {
    const [localType, setLocalType] = useState(modelType);
    const [localSearch, setLocalSearch] = useState(enableSearch);
    const [localImageGen, setLocalImageGen] = useState(enableImageGen);

    const isChanged = localType !== modelType || localSearch !== enableSearch || localImageGen !== enableImageGen;

    const handleSave = () => {
        setModelType(localType);
        setEnableSearch(localSearch);
        setEnableImageGen(localImageGen);
        showToast('Model settings updated!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Model & Capabilities</h1>
                <p className="text-slate-500 mt-1">Configure the intelligence engine and enabled tools.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
                
                {/* Model Selection */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Base Model</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                            onClick={() => setLocalType('flash')}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${localType === 'flash' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-gray-800">Gemini 2.5 Flash</span>
                                {localType === 'flash' && <div className="w-4 h-4 rounded-full bg-blue-500"></div>}
                            </div>
                            <p className="text-sm text-slate-500">Best for general purpose tasks, high speed, and multimodal understanding.</p>
                        </div>
                        
                        <div 
                            onClick={() => setLocalType('lite')}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${localType === 'lite' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-gray-800">Gemini Flash-Lite</span>
                                {localType === 'lite' && <div className="w-4 h-4 rounded-full bg-blue-500"></div>}
                            </div>
                            <p className="text-sm text-slate-500">Optimized for extreme low latency and cost-efficiency.</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Capabilities</h3>
                    
                    {/* Search Grounding */}
                    <div className="flex items-center justify-between p-4 mb-4 bg-slate-50 rounded-xl border border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800">Google Search Grounding</span>
                            <span className="text-xs text-gray-500 mt-1">Allow the model to search the web for real-time information.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={localSearch} onChange={() => setLocalSearch(!localSearch)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {/* Image Generation */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800">Image Generation</span>
                            <span className="text-xs text-gray-500 mt-1">Enable "Generate image..." commands using Gemini 2.5 Flash Image.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={localImageGen} onChange={() => setLocalImageGen(!localImageGen)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
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

export default ModelSettings;
