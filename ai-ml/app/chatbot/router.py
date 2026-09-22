from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatQueryRequest(BaseModel):
    query: str
    language: str = "te"
    context: dict | None = None

class ChatQueryResponse(BaseModel):
    answer: str
    suggestedActions: list[str]
    citations: list[str]

@router.post("/query", response_model=ChatQueryResponse)
def query_assistant(req: ChatQueryRequest):
    return ChatQueryResponse(
        answer="నమస్కారం! మీ పంటకు సంబంధించి ఏదైనా సలహా లేదా సస్యరక్షణ చర్యల కోసం నన్ను అడగవచ్చు. (Welcome! Ask me for any crop advisory or protection techniques.)",
        suggestedActions=[
            "Check Pest Control for Paddy",
            "View Weather Forecast",
            "Book Machinery for Harvesting"
        ],
        citations=["PJTSAU Agri Handbook 2026"]
    )
