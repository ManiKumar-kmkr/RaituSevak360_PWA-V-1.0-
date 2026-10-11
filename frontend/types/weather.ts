export type AlertSeverity = 'critical' | 'warning' | 'advisory' | 'info';

export type WeatherConditionCode =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rain-light'
  | 'rain-heavy'
  | 'thunderstorm'
  | 'windy';

export interface WeatherMetrics {
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string; // e.g., 'SE'
  precipitationChance: number; // %
  rainfallMm: number; // mm
  uvIndex: number; // 1-12
  uvDescriptionKey: string;
  pressure: number; // hPa
  dewPoint: number; // °C
  visibilityKm: number; // km
  sunrise: string; // e.g. '06:05 AM'
  sunset: string; // e.g. '06:18 PM'
}

export interface CurrentWeather {
  district: string;
  state: string;
  mandal?: string;
  temperature: number; // °C
  feelsLike: number; // °C
  tempMin: number;
  tempMax: number;
  condition: WeatherConditionCode;
  conditionLabelKey: string;
  summaryKey: string;
  updatedAt: string;
  metrics: WeatherMetrics;
}

export interface HourlyForecastItem {
  time: string; // e.g. '06:00', 'Now', etc.
  hour24: number;
  temperature: number; // °C
  condition: WeatherConditionCode;
  precipitationChance: number; // %
  windSpeed: number; // km/h
  isDaytime: boolean;
}

export interface DayPartForecast {
  partNameKey: string; // morning, afternoon, evening, night
  temp: number;
  condition: WeatherConditionCode;
  rainChance: number;
}

export interface DailyForecastItem {
  id: string;
  dayKey: string; // today, tomorrow, or day of week key
  dateFormatted: string; // e.g. '02 Oct'
  tempMin: number;
  tempMax: number;
  condition: WeatherConditionCode;
  conditionLabelKey: string;
  precipitationChance: number;
  rainfallMm: number;
  windSpeed: number;
  humidity: number;
  agriRecommendationKey: string;
  sprayingSuitability: 'favorable' | 'moderate' | 'unfavorable';
  dayParts?: DayPartForecast[];
}

export interface CropImpactItem {
  cropNameKey: string;
  riskLevel: 'high' | 'medium' | 'low';
  impactSummaryKey: string;
  advisoryKey: string;
}

export interface SevereWeatherAlertData {
  id: string;
  titleKey: string;
  severity: AlertSeverity;
  headlineKey: string;
  sourceKey: string;
  issuedAt: string;
  expiresAt: string;
  affectedDistricts: string[];
  descriptionKey: string;
  cropImpacts: CropImpactItem[];
  farmerActionSteps: string[]; // translation keys
  dontsList: string[]; // translation keys
  emergencyContacts: {
    titleKey: string;
    number: string;
    type: 'phone' | 'helpline';
  }[];
}

export interface AgriFieldworkAdvisory {
  statusKey: string;
  statusType: 'favorable' | 'caution' | 'danger';
  spraying: {
    status: 'optimal' | 'moderate' | 'avoid';
    windowTextKey: string;
  };
  irrigation: {
    status: 'needed' | 'moderate' | 'hold';
    adviceKey: string;
  };
  harvesting: {
    status: 'safe' | 'caution' | 'postpone';
    adviceKey: string;
  };
}

export interface WeatherDataBundle {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  alerts: SevereWeatherAlertData[];
  fieldwork: AgriFieldworkAdvisory;
}
