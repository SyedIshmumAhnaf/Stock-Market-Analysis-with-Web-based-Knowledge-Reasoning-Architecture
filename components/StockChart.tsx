import React, { useEffect, useRef } from 'react';
import { StockDataPoint } from '../types';

declare const Chart: any;

interface StockChartProps {
  data: StockDataPoint[];
  lineColor: string;
}

export const StockChart: React.FC<StockChartProps> = ({ data, lineColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Destroy previous chart instance if it exists
    if (chartRef.current) {
        chartRef.current.destroy();
    }

    const labels = data.map(d => `Day ${d.day + 1}`);
    const prices = data.map(d => d.price);

    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, `${lineColor}33`); // ~20% opacity
    gradient.addColorStop(1, `${lineColor}00`); // 0% opacity

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Price',
          data: prices,
          borderColor: lineColor,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
          backgroundColor: gradient,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            displayColors: false,
            callbacks: {
                title: () => '',
                label: (context: any) => `$${context.parsed.y.toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          }
        }
      }
    });

    // Cleanup function to destroy chart on component unmount
    return () => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }
    };
  }, [data, lineColor]);

  return <canvas ref={canvasRef}></canvas>;
};