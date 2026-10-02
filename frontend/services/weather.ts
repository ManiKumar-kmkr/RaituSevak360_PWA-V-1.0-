import {
  WeatherDataBundle,
  CurrentWeather,
  HourlyForecastItem,
  DailyForecastItem,
  SevereWeatherAlertData,
  AgriFieldworkAdvisory,
} from '../types/weather';

/**
 * Weather Service Abstraction for RaituSevak360 Farmer Module
 * 
 * Provides mock data for Phase 1-3 Farmer Weather Frontend.
 * Architecture is cleanly separated from UI components so it can be swapped
 * with real backend endpoints (/api/weather) without modifying page/component JSX.
 */

const MOCK_WEATHER_BUNDLE: WeatherDataBundle = {
  current: {
    district: 'Amaravati',
    state: 'Andhra Pradesh',
    mandal: 'Thullur',
    temperature: 29,
    feelsLike: 31,
    tempMin: 22,
    tempMax: 32,
    condition: 'sunny',
    conditionLabelKey: 'weather.conditions.sunny',
    summaryKey: 'weather.overview.currentSummary',
    updatedAt: '10m ago',
    metrics: {
      humidity: 58,
      windSpeed: 14,
      windDirection: 'SE',
      precipitationChance: 12,
      rainfallMm: 0,
      uvIndex: 6,
      uvDescriptionKey: 'weather.metrics.uvModerate',
      pressure: 1012,
      dewPoint: 20,
      visibilityKm: 9.5,
      sunrise: '06:04 AM',
      sunset: '06:14 PM',
    },
  },
  hourly: [
    { time: 'weather.hourly.now', hour24: 10, temperature: 29, condition: 'sunny', precipitationChance: 10, windSpeed: 14, isDaytime: true },
    { time: '11:00', hour24: 11, temperature: 31, condition: 'sunny', precipitationChance: 12, windSpeed: 16, isDaytime: true },
    { time: '12:00', hour24: 12, temperature: 32, condition: 'sunny', precipitationChance: 15, windSpeed: 18, isDaytime: true },
    { time: '13:00', hour24: 13, temperature: 33, condition: 'partly-cloudy', precipitationChance: 20, windSpeed: 17, isDaytime: true },
    { time: '14:00', hour24: 14, temperature: 32, condition: 'partly-cloudy', precipitationChance: 25, windSpeed: 19, isDaytime: true },
    { time: '15:00', hour24: 15, temperature: 31, condition: 'partly-cloudy', precipitationChance: 30, windSpeed: 20, isDaytime: true },
    { time: '16:00', hour24: 16, temperature: 30, condition: 'cloudy', precipitationChance: 35, windSpeed: 18, isDaytime: true },
    { time: '17:00', hour24: 17, temperature: 28, condition: 'rain-light', precipitationChance: 55, windSpeed: 22, isDaytime: true },
    { time: '18:00', hour24: 18, temperature: 26, condition: 'rain-light', precipitationChance: 60, windSpeed: 21, isDaytime: false },
    { time: '19:00', hour24: 19, temperature: 25, condition: 'cloudy', precipitationChance: 40, windSpeed: 15, isDaytime: false },
    { time: '20:00', hour24: 20, temperature: 24, condition: 'cloudy', precipitationChance: 25, windSpeed: 12, isDaytime: false },
    { time: '21:00', hour24: 21, temperature: 23, condition: 'partly-cloudy', precipitationChance: 15, windSpeed: 10, isDaytime: false },
  ],
  daily: [
    {
      id: 'd-1',
      dayKey: 'weather.days.today',
      dateFormatted: '02 Oct',
      tempMin: 22,
      tempMax: 32,
      condition: 'sunny',
      conditionLabelKey: 'weather.conditions.sunny',
      precipitationChance: 15,
      rainfallMm: 0,
      windSpeed: 14,
      humidity: 58,
      agriRecommendationKey: 'weather.forecast.recDay1',
      sprayingSuitability: 'favorable',
      dayParts: [
        { partNameKey: 'weather.parts.morning', temp: 26, condition: 'sunny', rainChance: 5 },
        { partNameKey: 'weather.parts.afternoon', temp: 32, condition: 'sunny', rainChance: 15 },
        { partNameKey: 'weather.parts.evening', temp: 28, condition: 'partly-cloudy', rainChance: 20 },
        { partNameKey: 'weather.parts.night', temp: 23, condition: 'partly-cloudy', rainChance: 10 },
      ],
    },
    {
      id: 'd-2',
      dayKey: 'weather.days.tomorrow',
      dateFormatted: '03 Oct',
      tempMin: 23,
      tempMax: 30,
      condition: 'partly-cloudy',
      conditionLabelKey: 'weather.conditions.partlyCloudy',
      precipitationChance: 40,
      rainfallMm: 3.5,
      windSpeed: 18,
      humidity: 68,
      agriRecommendationKey: 'weather.forecast.recDay2',
      sprayingSuitability: 'moderate',
      dayParts: [
        { partNameKey: 'weather.parts.morning', temp: 25, condition: 'partly-cloudy', rainChance: 20 },
        { partNameKey: 'weather.parts.afternoon', temp: 30, condition: 'cloudy', rainChance: 45 },
        { partNameKey: 'weather.parts.evening', temp: 27, condition: 'rain-light', rainChance: 50 },
        { partNameKey: 'weather.parts.night', temp: 24, condition: 'cloudy', rainChance: 30 },
      ],
    },
    {
      id: 'd-3',
      dayKey: 'weather.days.saturday',
      dateFormatted: '04 Oct',
      tempMin: 21,
      tempMax: 27,
      condition: 'thunderstorm',
      conditionLabelKey: 'weather.conditions.thunderstorm',
      precipitationChance: 85,
      rainfallMm: 38,
      windSpeed: 34,
      humidity: 88,
      agriRecommendationKey: 'weather.forecast.recDay3',
      sprayingSuitability: 'unfavorable',
      dayParts: [
        { partNameKey: 'weather.parts.morning', temp: 24, condition: 'rain-light', rainChance: 70 },
        { partNameKey: 'weather.parts.afternoon', temp: 27, condition: 'thunderstorm', rainChance: 90 },
        { partNameKey: 'weather.parts.evening', temp: 23, condition: 'rain-heavy', rainChance: 85 },
        { partNameKey: 'weather.parts.night', temp: 21, condition: 'rain-light', rainChance: 60 },
      ],
    },
    {
      id: 'd-4',
      dayKey: 'weather.days.sunday',
      dateFormatted: '05 Oct',
      tempMin: 22,
      tempMax: 28,
      condition: 'rain-heavy',
      conditionLabelKey: 'weather.conditions.rainHeavy',
      precipitationChance: 75,
      rainfallMm: 24,
      windSpeed: 26,
      humidity: 82,
      agriRecommendationKey: 'weather.forecast.recDay4',
      sprayingSuitability: 'unfavorable',
      dayParts: [
        { partNameKey: 'weather.parts.morning', temp: 23, condition: 'rain-light', rainChance: 65 },
        { partNameKey: 'weather.parts.afternoon', temp: 28, condition: 'rain-heavy', rainChance: 80 },
        { partNameKey: 'weather.parts.evening', temp: 25, condition: 'cloudy', rainChance: 50 },
        { partNameKey: 'weather.parts.night', temp: 22, condition: 'cloudy', rainChance: 30 },
      ],
    },
    {
      id: 'd-5',
      dayKey: 'weather.days.monday',
      dateFormatted: '06 Oct',
      tempMin: 23,
      tempMax: 31,
      condition: 'partly-cloudy',
      conditionLabelKey: 'weather.conditions.partlyCloudy',
      precipitationChance: 30,
      rainfallMm: 1.2,
      windSpeed: 15,
      humidity: 65,
      agriRecommendationKey: 'weather.forecast.recDay5',
      sprayingSuitability: 'moderate',
      dayParts: [
        { partNameKey: 'weather.parts.morning', temp: 24, condition: 'partly-cloudy', rainChance: 15 },
        { partNameKey: 'weather.parts.afternoon', temp: 31, condition: 'partly-cloudy', rainChance: 30 },
        { partNameKey: 'weather.parts.evening', temp: 27, condition: 'sunny', rainChance: 20 },
        { partNameKey: 'weather.parts.night', temp: 23, condition: 'sunny', rainChance: 10 },
      ],
    },
    {
      id: 'd-6',
      dayKey: 'weather.days.tuesday',
      dateFormatted: '07 Oct',
      tempMin: 24,
      tempMax: 33,
      condition: 'sunny',
      conditionLabelKey: 'weather.conditions.sunny',
      precipitationChance: 10,
      rainfallMm: 0,
      windSpeed: 12,
      humidity: 55,
      agriRecommendationKey: 'weather.forecast.recDay6',
      sprayingSuitability: 'favorable',
      dayParts: [
        { partNameKey: 'weather.parts.morning', temp: 25, condition: 'sunny', rainChance: 5 },
        { partNameKey: 'weather.parts.afternoon', temp: 33, condition: 'sunny', rainChance: 10 },
        { partNameKey: 'weather.parts.evening', temp: 28, condition: 'sunny', rainChance: 10 },
        { partNameKey: 'weather.parts.night', temp: 24, condition: 'sunny', rainChance: 5 },
      ],
    },
    {
      id: 'd-7',
      dayKey: 'weather.days.wednesday',
      dateFormatted: '08 Oct',
      tempMin: 23,
      tempMax: 32,
      condition: 'sunny',
      conditionLabelKey: 'weather.conditions.sunny',
      precipitationChance: 15,
      rainfallMm: 0,
      windSpeed: 13,
      humidity: 58,
      agriRecommendationKey: 'weather.forecast.recDay7',
      sprayingSuitability: 'favorable',
      dayParts: [
        { partNameKey: 'weather.parts.morning', temp: 25, condition: 'sunny', rainChance: 10 },
        { partNameKey: 'weather.parts.afternoon', temp: 32, condition: 'sunny', rainChance: 15 },
        { partNameKey: 'weather.parts.evening', temp: 28, condition: 'sunny', rainChance: 10 },
        { partNameKey: 'weather.parts.night', temp: 24, condition: 'sunny', rainChance: 5 },
      ],
    },
  ],
  alerts: [
    {
      id: 'alert-imd-001',
      titleKey: 'weather.alert.heavyRainThunderstorm',
      severity: 'warning',
      headlineKey: 'weather.alert.imdHeadline',
      sourceKey: 'weather.alert.sourceImd',
      issuedAt: 'Today, 08:30 AM',
      expiresAt: '04 Oct, 08:00 PM',
      affectedDistricts: ['Guntur', 'Krishna', 'Amaravati Mandal', 'NTR District'],
      descriptionKey: 'weather.alert.descriptionText',
      cropImpacts: [
        {
          cropNameKey: 'weather.crops.paddy',
          riskLevel: 'high',
          impactSummaryKey: 'weather.alert.paddyImpact',
          advisoryKey: 'weather.alert.paddyAdvisory',
        },
        {
          cropNameKey: 'weather.crops.cotton',
          riskLevel: 'high',
          impactSummaryKey: 'weather.alert.cottonImpact',
          advisoryKey: 'weather.alert.cottonAdvisory',
        },
        {
          cropNameKey: 'weather.crops.chilli',
          riskLevel: 'medium',
          impactSummaryKey: 'weather.alert.chilliImpact',
          advisoryKey: 'weather.alert.chilliAdvisory',
        },
      ],
      farmerActionSteps: [
        'weather.alert.action1',
        'weather.alert.action2',
        'weather.alert.action3',
        'weather.alert.action4',
      ],
      dontsList: [
        'weather.alert.dont1',
        'weather.alert.dont2',
        'weather.alert.dont3',
      ],
      emergencyContacts: [
        {
          titleKey: 'weather.alert.contactKisan',
          number: '1800-180-1551',
          type: 'helpline',
        },
        {
          titleKey: 'weather.alert.contactDisaster',
          number: '1070',
          type: 'phone',
        },
        {
          titleKey: 'weather.alert.contactDistrictAgri',
          number: '0863-2234001',
          type: 'phone',
        },
      ],
    },
  ],
  fieldwork: {
    statusKey: 'weather.fieldwork.favorableToday',
    statusType: 'favorable',
    spraying: {
      status: 'optimal',
      windowTextKey: 'weather.fieldwork.sprayOptimal',
    },
    irrigation: {
      status: 'moderate',
      adviceKey: 'weather.fieldwork.irrigateModerate',
    },
    harvesting: {
      status: 'safe',
      adviceKey: 'weather.fieldwork.harvestSafe',
    },
  },
};

export const weatherService = {
  /**
   * Fetches complete weather data bundle for a district
   */
  async getWeatherDataBundle(_district?: string): Promise<WeatherDataBundle> {
    // Simulated micro-delay for realistic network feel
    await new Promise((resolve) => setTimeout(resolve, 80));
    return MOCK_WEATHER_BUNDLE;
  },

  /**
   * Fetches current weather
   */
  async getCurrentWeather(_district?: string): Promise<CurrentWeather> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return MOCK_WEATHER_BUNDLE.current;
  },

  /**
   * Fetches hourly forecast
   */
  async getHourlyForecast(_district?: string): Promise<HourlyForecastItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return MOCK_WEATHER_BUNDLE.hourly;
  },

  /**
   * Fetches 7-day agricultural forecast
   */
  async getDailyForecast(_district?: string): Promise<DailyForecastItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return MOCK_WEATHER_BUNDLE.daily;
  },

  /**
   * Fetches active severe weather alerts
   */
  async getSevereWeatherAlerts(_district?: string): Promise<SevereWeatherAlertData[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return MOCK_WEATHER_BUNDLE.alerts;
  },

  /**
   * Fetches fieldwork and operational advisory
   */
  async getFieldworkAdvisory(_district?: string): Promise<AgriFieldworkAdvisory> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return MOCK_WEATHER_BUNDLE.fieldwork;
  },
};

export default weatherService;
