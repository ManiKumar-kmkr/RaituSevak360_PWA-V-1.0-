from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class CropRecommendationRequest(BaseModel):
    state: str
    district: str
    season: str
    waterAvailability: str

@router.post("/suggest-crops")
def suggest_optimal_crops(req: CropRecommendationRequest):
    return {
        "topCrops": [
            {"crop": "Paddy", "variety": "BPT 5204 (Samba Mahsuri)", "profitEstimatePerAcre": 38000, "riskLevel": "Low"},
            {"crop": "Cotton", "variety": "Bt Cotton Hybrid", "profitEstimatePerAcre": 42000, "riskLevel": "Medium"},
            {"crop": "Red Gram", "variety": "PRG 176", "profitEstimatePerAcre": 31000, "riskLevel": "Low"}
        ]
    }
