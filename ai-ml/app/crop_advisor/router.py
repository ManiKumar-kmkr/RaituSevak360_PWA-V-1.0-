from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AdvisoryRequest(BaseModel):
    cropName: str
    stage: str
    soilType: str
    location: str

class AdvisoryResponse(BaseModel):
    crop: str
    stage: str
    advisory: str
    recommendations: list[str]

@router.post("/recommend", response_model=AdvisoryResponse)
def get_advisory(req: AdvisoryRequest):
    return AdvisoryResponse(
        crop=req.cropName,
        stage=req.stage,
        advisory=f"Optimized AI agronomy advisory for {req.cropName} at {req.stage} stage in {req.soilType} soil.",
        recommendations=[
            "Monitor soil nitrogen and apply micronutrient spray if yellowing occurs.",
            "Schedule next irrigation in 3 days based on current evapotranspiration rates.",
            "Check underleaves for early aphid / thrip infestation.",
        ],
    )
