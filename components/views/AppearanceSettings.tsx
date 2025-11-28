import React, { useState, useEffect } from 'react';
import { WidgetPosition } from '../../types';

interface AppearanceSettingsProps {
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    widgetPosition: WidgetPosition;
    setWidgetPosition: (position: WidgetPosition) => void;
    headerText: string;
    setHeaderText: (text: string) => void;
    showToast: (message: string) => void;
}

const DEFAULTS = {
    primaryColor: '#3B82F6',
    widgetPosition: 'bottom-right' as WidgetPosition,
    headerText: 'Chat Bot',
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ 
    primaryColor, 
    setPrimaryColor, 
    widgetPosition, 
    setWidgetPosition, 
    headerText, 
    setHeaderText,
    showToast
}) => {
    const [color, setColor] = useState(primaryColor);
    const [position, setPosition] = useState(widgetPosition);
    const [header, setHeader] = useState(headerText);

    useEffect(() => {
        setColor(primaryColor);
        setPosition(widgetPosition);
        setHeader(headerText);
    }, [primaryColor, widgetPosition, headerText]);

    const isChanged = color !== primaryColor || position !== widgetPosition || header !== headerText;

    const handleSave = () => {
        setPrimaryColor(color);
        setWidgetPosition(position);
        setHeaderText(header);
        showToast('Appearance settings saved!');
    };

    const handleReset = () => {
        setColor(DEFAULTS.primaryColor);
        setPosition(DEFAULTS.widgetPosition);
        setHeader(DEFAULTS.headerText);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Appearance</h1>
                <p className="text-slate-500 mt-1">Customize the look and feel of your chat widget.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
                {/* Header Text */}
                <div className="max-w-md">
                    <label htmlFor="header-text" className="block text-sm font-semibold text-gray-700 mb-2">
                        Header Text
                    </label>
                    <input
                        id="header-text"
                        type="text"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 transition-all"
                        value={header}
                        onChange={(e) => setHeader(e.target.value)}
                    />
                </div>

                {/* Primary Color */}
                <div className="max-w-md">
                    <label htmlFor="primary-color" className="block text-sm font-semibold text-gray-700 mb-2">
                        Brand Color
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="relative overflow-hidden w-14 h-14 rounded-xl shadow-sm ring-1 ring-gray-200">
                             <input
                                id="primary-color"
                                type="color"
                                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-mono text-sm text-gray-600">{color.toUpperCase()}</span>
                            <span className="text-xs text-gray-400">Click circle to pick</span>
                        </div>
                    </div>
                </div>

                {/* Widget Position */}
                <div>
                    <span className="block text-sm font-semibold text-gray-700 mb-3">Widget Position</span>
                    <div className="flex gap-4">
                        <label className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all w-32 ${position === 'bottom-right' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input
                                type="radio"
                                className="sr-only"
                                name="widgetPosition"
                                value="bottom-right"
                                checked={position === 'bottom-right'}
                                onChange={() => setPosition('bottom-right')}
                            />
                            <div className="w-16 h-10 bg-gray-200 rounded mb-2 relative">
                                <div className="absolute bottom-1 right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                            <span className={`text-sm font-medium ${position === 'bottom-right' ? 'text-blue-700' : 'text-gray-600'}`}>Right</span>
                        </label>
                        
                        <label className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all w-32 ${position === 'bottom-left' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input
                                type="radio"
                                className="sr-only"
                                name="widgetPosition"
                                value="bottom-left"
                                checked={position === 'bottom-left'}
                                onChange={() => setPosition('bottom-left')}
                            />
                            <div className="w-16 h-10 bg-gray-200 rounded mb-2 relative">
                                <div className="absolute bottom-1 left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                            <span className={`text-sm font-medium ${position === 'bottom-left' ? 'text-blue-700' : 'text-gray-600'}`}>Left</span>
                        </label>
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

export default AppearanceSettings;