import { WeatherModel } from '../../../database/models/Weather';

export class WeatherService {
  async getWeatherByLocation(district: string, state = 'Telangana') {
    let weather = await WeatherModel.findOne({ 'location.district': district });

    if (!weather) {
      // Baseline placeholder structure for weather service integration
      weather = await WeatherModel.create({
        location: {
          type: 'Point',
          coordinates: [78.4867, 17.385],
          district,
          state,
        },
        temperatureCelsius: 31,
        humidityPercentage: 68,
        rainfallMm: 2.5,
        windSpeedKmh: 14,
        condition: 'Partly Cloudy',
        forecastDays: [
          {
            date: new Date(),
            tempMin: 24,
            tempMax: 33,
            rainfallProbability: 30,
            summary: 'Scattered clouds, moderate breeze',
          },
        ],
        alerts: ['Moderate rainfall expected over the weekend'],
      });
    }

    return weather;
  }
}

export const weatherService = new WeatherService();
