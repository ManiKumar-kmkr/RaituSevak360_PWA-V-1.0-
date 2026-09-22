from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class DiseaseDiagnosisRequest(BaseModel):
    imageData: str
    cropType: str

class DiseaseDiagnosisResponse(BaseModel):
    diseaseDetected: bool
    diseaseName: str | None = None
    confidence: float
    treatmentSummary: str
    recommendedPesticides: list[str]

@router.post("/predict", response_model=DiseaseDiagnosisResponse)
def predict_disease(req: DiseaseDiagnosisRequest):
    # PyTorch / Vision model inference placeholder
    return DiseaseDiagnosisResponse(
        diseaseDetected=False,
        confidence=0.94,
        treatmentSummary="Foliage appears healthy with no major pathogen spots detected.",
        recommendedPesticides=[],
    )
