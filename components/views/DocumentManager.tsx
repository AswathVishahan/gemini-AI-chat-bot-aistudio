import React, { useRef, useState, useCallback } from 'react';
import { Document } from '../../types';
import { readFileAsText } from '../../utils/fileUtils';
import PaperclipIcon from '../icons/PaperclipIcon';
import DocumentIcon from '../icons/DocumentIcon';
import TrashIcon from '../icons/TrashIcon';

interface DocumentManagerProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  activeDocumentName: string | null;
  setActiveDocumentName: (name: string | null) => void;
  showToast: (message: string) => void;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  setDocuments,
  activeDocumentName,
  setActiveDocumentName,
  showToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (documents.some(doc => doc.name === file.name)) {
      setError(`A document with the name "${file.name}" already exists.`);
      return;
    }
    try {
      setError(null);
      const content = await readFileAsText(file);
      const newDocument: Document = { name: file.name, content };
      setDocuments(prev => [...prev, newDocument]);
      showToast(`Document "${file.name}" uploaded.`);
    } catch (err) {
      console.error('Error reading file:', err);
      setError('Sorry, there was an error reading the file.');
    }
  }, [documents, setDocuments, showToast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };


  const handleDelete = (docName: string) => {
    setDocuments(prev => prev.filter(doc => doc.name !== docName));
    if (activeDocumentName === docName) {
      setActiveDocumentName(null);
    }
    showToast(`Document "${docName}" deleted.`);
  };

  const handleSetActive = (docName: string) => {
    setActiveDocumentName(docName);
    showToast(`"${docName}" is now the active context.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Knowledge Base</h1>
            <p className="text-slate-500 mt-1">Manage documents to provide context for your AI.</p>
        </div>
        
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".txt,.md,.json,.csv" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
        >
          <PaperclipIcon />
          Upload File
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
        </div>
      )}

      <div 
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 p-8 text-center
            ${isDragging 
                ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
                : 'border-slate-200 bg-white hover:border-slate-300'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {documents.length > 0 ? (
          <div className="space-y-3 text-left">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Uploaded Files ({documents.length})</h3>
            {documents.map(doc => (
              <div key={doc.name} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                    <DocumentIcon className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-gray-700 truncate max-w-[200px] md:max-w-md" title={doc.name}>{doc.name}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleSetActive(doc.name)}
                    disabled={activeDocumentName === doc.name}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                        activeDocumentName === doc.name 
                        ? 'bg-green-100 text-green-700 cursor-default' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {activeDocumentName === doc.name ? 'Active Context' : 'Set Active'}
                  </button>
                  <button
                    onClick={() => handleDelete(doc.name)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete file"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12">
            <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <PaperclipIcon />
            </div>
            <p className="text-lg text-gray-700 font-semibold">Drop files here to upload</p>
            <p className="text-sm text-slate-400 mt-2">or click the button above</p>
            <p className="text-xs text-slate-300 mt-6">Supports .txt, .md, .json, .csv</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentManager;