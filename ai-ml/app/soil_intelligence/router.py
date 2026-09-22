from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class SoilAnalysisRequest(BaseModel):
    phLevel: float
    nitrogen: float
    phosphorus: float
    potassium: float
    soilType: str

class SoilAnalysisResponse(BaseModel):
    soilHealthScore: int
    nutrientStatus: dict
    suggestedCrops: list[str]
    fertilizerDosage: str

@router.post("/analyze", response_model=SoilAnalysisResponse)
def analyze_soil(req: SoilAnalysisRequest):
    return SoilAnalysisResponse(
        soilHealthScore=85,
        nutrientStatus={
            "nitrogen": "Optimal",
            "phosphorus": "Slightly Low",
            "potassium": "Optimal",
            "ph": "Neutral (6.8)"
        },
        suggestedCrops=["Paddy", "Cotton", "Maize", "Chilli"],
        fertilizerDosage="Apply 25kg/acre Single Super Phosphate to correct phosphorus deficit."
    )
