import { Request, Response, NextFunction } from 'express';
import { weatherService } from '../services/weather.service';
import { sendSuccess } from '../utils/response';

export const getWeather = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const district = (req.query.district as string) || 'Karimnagar';
    const state = (req.query.state as string) || 'Telangana';
    const weather = await weatherService.getWeatherByLocation(district, state);
    sendSuccess(res, weather, 'Weather data retrieved');
  } catch (error) {
    next(error);
  }
};
