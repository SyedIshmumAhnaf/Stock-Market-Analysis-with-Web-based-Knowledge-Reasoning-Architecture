import React from 'react';
import { SimplePredictionResult, Prediction } from '../types';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from './icons';
import { StockChart } from './StockChart';

const predictionConfig = {
  [Prediction.UP]: {
    text: 'Predicted Trend: UP',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    icon: <ArrowUpIcon className="w-8 h-8" />,
    chartColor: '#4ade80', // green-400
  },
  [Prediction.DOWN]: {
    text: 'Predicted Trend: DOWN',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    icon: <ArrowDownIcon className="w-8 h-8" />,
    chartColor: '#f87171', // red-400
  },
  [Prediction.HOLD]: {
    text: 'Predicted Trend: HOLD',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
    icon: <MinusIcon className="w-8 h-8" />,
    chartColor: '#94a3b8', // slate-400
  },
};

interface PredictionCardProps {
  result: SimplePredictionResult;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ result }) => {
  const config = predictionConfig[result.prediction];

  return (
    <div className={`p-6 rounded-lg shadow-xl border ${config.borderColor} ${config.bgColor} flex flex-col`}>
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Stage 1: Initial ML Prediction</h2>
      
      <div className="text-center mb-4">
        <h3 className="text-4xl font-bold text-white mb-2">{result.ticker}</h3>
        <div className={`flex items-center justify-center gap-3 ${config.color} mb-2`}>
          {config.icon}
          <span className="text-2xl font-semibold">{config.text.replace('Predicted Trend: ', '')}</span>
        </div>
        <div className="text-slate-300">
          <span className="font-medium">Confidence: </span>
          <span className={`text-xl font-bold ${config.color}`}>{result.confidence}%</span>
        </div>
      </div>
      
      <div className="flex-grow mt-4">
         <p className="text-xs text-center text-slate-500 mb-2">Simulated 30-Day Historical Data</p>
         <div className="h-48">
            <StockChart data={result.historicalData} lineColor={config.chartColor} />
         </div>
      </div>

    </div>
  );
};