import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IWeather extends Document {
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
    district: string;
    state: string;
  };
  temperatureCelsius: number;
  humidityPercentage: number;
  rainfallMm: number;
  windSpeedKmh: number;
  condition: string; // e.g., sunny, rainy, cloudy
  forecastDays: Array<{
    date: Date;
    tempMin: number;
    tempMax: number;
    rainfallProbability: number;
    summary: string;
  }>;
  alerts?: string[];
  recordedAt: Date;
}

const WeatherSchema = new Schema<IWeather>(
  {
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
    },
    temperatureCelsius: { type: Number, required: true },
    humidityPercentage: { type: Number, required: true },
    rainfallMm: { type: Number, default: 0 },
    windSpeedKmh: { type: Number, default: 0 },
    condition: { type: String, required: true },
    forecastDays: [
      {
        date: { type: Date, required: true },
        tempMin: { type: Number, required: true },
        tempMax: { type: Number, required: true },
        rainfallProbability: { type: Number, required: true },
        summary: { type: String },
      },
    ],
    alerts: [{ type: String }],
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

WeatherSchema.index({ 'location.coordinates': '2dsphere' });

export const WeatherModel: Model<IWeather> =
  mongoose.models.Weather || mongoose.model<IWeather>('Weather', WeatherSchema);
