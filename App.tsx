import React, { useState, useCallback } from 'react';
import { StockInput } from './components/StockInput';
import { PredictionCard } from './components/PredictionCard';
import { GeminiAnalysisCard } from './components/GeminiAnalysisCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SimplePredictionResult, GeminiAnalysisResult, Prediction, StockDataPoint } from './types';
import { fetchRefinedAnalysis } from './services/geminiService';
import { LogoIcon } from './components/icons';

const generateStockData = (prediction: Prediction): StockDataPoint[] => {
  const data: StockDataPoint[] = [];
  let price = 100 + Math.random() * 50; // Start with a random price
  const days = 30;

  let trend;
  switch (prediction) {
    case Prediction.UP:
      trend = 0.5;
      break;
    case Prediction.DOWN:
      trend = -0.5;
      break;
    default:
      trend = 0;
  }

  for (let i = 0; i < days; i++) {
    const volatility = (Math.random() - 0.5) * 5;
    price += trend * (i / days) + volatility;
    price = Math.max(10, price); // ensure price doesn't go below 10
    data.push({
      day: i,
      price: parseFloat(price.toFixed(2)),
    });
  }
  return data;
};


const App: React.FC = () => {
  const [ticker, setTicker] = useState<string>('GOOGL');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [simplePrediction, setSimplePrediction] = useState<SimplePredictionResult | null>(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiAnalysisResult | null>(null);

  const handlePredict = useCallback(async () => {
    if (!ticker) {
      setError('Please enter a stock ticker.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSimplePrediction(null);
    setGeminiAnalysis(null);

    // Stage 1: Simulate a simple ML prediction
    const predictions = [Prediction.UP, Prediction.DOWN, Prediction.HOLD];
    const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
    const randomConfidence = Math.floor(Math.random() * (95 - 70 + 1)) + 70;
    const historicalData = generateStockData(randomPrediction);
    
    const initialPrediction: SimplePredictionResult = {
      ticker: ticker.toUpperCase(),
      prediction: randomPrediction,
      confidence: randomConfidence,
      historicalData,
    };
    setSimplePrediction(initialPrediction);

    // Stage 2: Get refined judgment from Gemini
    try {
      const analysis = await fetchRefinedAnalysis(
        initialPrediction.ticker,
        initialPrediction.prediction,
        initialPrediction.confidence
      );
      setGeminiAnalysis(analysis);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get refined analysis: ${errorMessage}`);
      // Keep the simple prediction card visible even if Gemini fails
    } finally {
      setIsLoading(false);
    }
  }, [ticker]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <LogoIcon className="h-10 w-10 text-teal-400"/>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Gemini Stock Analysis</h1>
            <p className="text-sm sm:text-base text-slate-400">ML Prediction with AI-Powered Refined Judgment</p>
          </div>
        </header>

        <main>
          <div className="bg-slate-800/50 p-6 rounded-lg shadow-xl border border-slate-700 mb-8">
            <StockInput
              ticker={ticker}
              setTicker={setTicker}
              onPredict={handlePredict}
              isLoading={isLoading}
            />
          </div>

          {isLoading && !simplePrediction && (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {simplePrediction && <PredictionCard result={simplePrediction} />}
            {geminiAnalysis ? (
              <GeminiAnalysisCard result={geminiAnalysis} />
            ) : isLoading && simplePrediction ? (
              <div className="bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-700 flex flex-col items-center justify-center min-h-[300px]">
                <LoadingSpinner />
                <p className="mt-4 text-slate-400">Searching the web and refining judgment...</p>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;