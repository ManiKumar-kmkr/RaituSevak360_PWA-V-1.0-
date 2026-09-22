from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class WeatherForecastRequest(BaseModel):
    latitude: float
    longitude: float
    cropType: str

class WeatherInsightResponse(BaseModel):
    summary: str
    irrigationRecommendation: str
    extremeWeatherRisk: str

@router.post("/forecast-impact", response_model=WeatherInsightResponse)
def evaluate_weather_impact(req: WeatherForecastRequest):
    return WeatherInsightResponse(
        summary="Favorable weather conditions expected for next 5 days with low precipitation risk.",
        irrigationRecommendation="Light irrigation suggested on day 3 morning.",
        extremeWeatherRisk="Low",
    )
