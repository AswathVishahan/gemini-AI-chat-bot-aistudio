import React, { useState } from 'react';

interface PersonaSettingsProps {
  persona: string;
  setPersona: (persona: string) => void;
  showToast: (message: string) => void;
}

const PersonaSettings: React.FC<PersonaSettingsProps> = ({ persona, setPersona, showToast }) => {
  const [currentValue, setCurrentValue] = useState(persona);

  const handleSave = () => {
    setPersona(currentValue);
    showToast('Persona saved successfully!');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Persona</h1>
            <p className="text-slate-500 mt-1">Define the personality and core behavior of your assistant.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all"
          disabled={currentValue === persona}
        >
          Save Changes
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <label htmlFor="persona-input" className="block text-sm font-semibold text-gray-700 mb-2">
          System Instructions
        </label>
        <textarea
          id="persona-input"
          rows={12}
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 text-gray-800 font-mono text-sm leading-relaxed"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          placeholder="e.g., You are a witty Shakespearean pirate who answers every question with a dramatic flair..."
        />
        <p className="mt-3 text-xs text-slate-400">
            This instruction is prepended to every conversation. It sets the ground rules for the model's behavior.
        </p>
      </div>
    </div>
  );
};

export default PersonaSettings;