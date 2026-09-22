from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.crop_advisor.router import router as crop_advisor_router
from app.disease_detection.router import router as disease_detection_router
from app.soil_intelligence.router import router as soil_intelligence_router
from app.weather_intelligence.router import router as weather_intelligence_router
from app.recommendations.router import router as recommendations_router
from app.chatbot.router import router as chatbot_router
from app.rag.router import router as rag_router

app = FastAPI(
    title="RaituSevak360 AI/ML Microservice",
    description="Machine Learning, Vision, and RAG services for Smart Agriculture",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(crop_advisor_router, prefix="/api/v1/crop-advisor", tags=["Crop Advisor"])
app.include_router(disease_detection_router, prefix="/api/v1/disease-detection", tags=["Disease Detection"])
app.include_router(soil_intelligence_router, prefix="/api/v1/soil-intelligence", tags=["Soil Intelligence"])
app.include_router(weather_intelligence_router, prefix="/api/v1/weather-intelligence", tags=["Weather Intelligence"])
app.include_router(recommendations_router, prefix="/api/v1/recommendations", tags=["Recommendations"])
app.include_router(chatbot_router, prefix="/api/v1/chatbot", tags=["Chatbot"])
app.include_router(rag_router, prefix="/api/v1/rag", tags=["RAG Pipeline"])

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "RaituSevak360 AI/ML Engine",
        "version": "1.0.0"
    }
