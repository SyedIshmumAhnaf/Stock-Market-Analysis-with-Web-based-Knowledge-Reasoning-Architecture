export enum Prediction {
  UP = 'UP',
  DOWN = 'DOWN',
  HOLD = 'HOLD',
}

export interface StockDataPoint {
    day: number;
    price: number;
}

export interface SimplePredictionResult {
  ticker: string;
  prediction: Prediction;
  confidence: number;
  historicalData: StockDataPoint[];
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface GeminiAnalysisResult {
  analysis: string;
  sources: GroundingSource[];
}