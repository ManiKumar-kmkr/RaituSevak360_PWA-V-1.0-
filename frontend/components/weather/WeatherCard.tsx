import React from 'react';

export interface WeatherCardProps {
  district: string;
  temperature: number;
  condition: string;
  humidity: number;
  rainProbability: number;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  district,
  temperature,
  condition,
  humidity,
  rainProbability,
}) => {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-5 text-white shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-blue-100 uppercase">{district} వాతావరణం</p>
          <h3 className="mt-1 text-3xl font-bold">{temperature}°C</h3>
          <p className="text-xs text-blue-100">{condition}</p>
        </div>
        <span className="text-4xl">🌦️</span>
      </div>
      <div className="mt-4 flex gap-4 border-t border-blue-400/30 pt-3 text-xs">
        <div>తేమ: {humidity}%</div>
        <div>వర్ష సూచన: {rainProbability}%</div>
      </div>
    </div>
  );
};
