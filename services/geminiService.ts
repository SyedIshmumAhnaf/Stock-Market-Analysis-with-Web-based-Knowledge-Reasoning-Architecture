
import { GoogleGenAI } from "@google/genai";
import { Prediction, GeminiAnalysisResult, GroundingSource } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchRefinedAnalysis(
  ticker: string,
  prediction: Prediction,
  confidence: number
): Promise<GeminiAnalysisResult> {
  const prompt = `
    An initial machine learning model predicts that the stock for ${ticker} will go ${prediction} with ${confidence}% confidence.
    
    Your task is to act as an expert financial analyst. Use Google Search to find the latest news, financial reports, and market sentiment for ${ticker}.
    
    Based on this recent information, provide a refined, brief analysis of this prediction in a single paragraph. Discuss the key factors that support or challenge the initial prediction. Conclude with whether the ML prediction seems plausible and why.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}],
        },
    });

    const analysis = response.text.trim();
    
    const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: GroundingSource[] = rawSources
      .filter((chunk: any) => chunk.web && chunk.web.uri && chunk.web.title)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title,
      }))
      // Remove duplicate URIs
      .filter((source, index, self) => 
        index === self.findIndex((s) => s.uri === source.uri)
      );

    if (!analysis) {
        throw new Error("The API returned an empty analysis.");
    }

    return { analysis, sources };

  } catch (error) {
    console.error("Error fetching refined analysis from Gemini:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}
