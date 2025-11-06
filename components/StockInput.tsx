
import React from 'react';
import { SearchIcon } from './icons';

interface StockInputProps {
  ticker: string;
  setTicker: (ticker: string) => void;
  onPredict: () => void;
  isLoading: boolean;
}

export const StockInput: React.FC<StockInputProps> = ({ ticker, setTicker, onPredict, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="ticker-input" className="block text-sm font-medium text-slate-300 mb-2">
        Enter Stock Ticker (e.g., GOOGL, AAPL, MSFT)
      </label>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          id="ticker-input"
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="GOOGL"
          className="flex-grow bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-lg rounded-md focus:ring-teal-500 focus:border-teal-500 block w-full p-3 transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          disabled={isLoading}
        >
          <SearchIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Analyzing...' : 'Predict & Analyze'}
        </button>
      </div>
    </form>
  );
};
