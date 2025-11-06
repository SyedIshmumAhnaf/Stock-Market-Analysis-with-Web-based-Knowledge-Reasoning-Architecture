
import React from 'react';
import { GeminiAnalysisResult } from '../types';
import { BrainCircuitIcon } from './icons';

interface GeminiAnalysisCardProps {
  result: GeminiAnalysisResult;
}

export const GeminiAnalysisCard: React.FC<GeminiAnalysisCardProps> = ({ result }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-700 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <BrainCircuitIcon className="w-6 h-6 text-teal-400" />
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Stage 2: Gemini Refined Judgment</h2>
      </div>

      <div className="prose prose-invert prose-sm max-w-none text-slate-300">
        <p>{result.analysis}</p>
      </div>

      {result.sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Sources</h4>
          <ul className="space-y-2">
            {result.sources.map((source, index) => (
              <li key={index} className="truncate">
                <a
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300 text-sm transition duration-150 ease-in-out hover:underline"
                  title={source.title}
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
