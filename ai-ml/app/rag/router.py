from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class RAGSearchRequest(BaseModel):
    query: str
    topK: int = 4

class RAGSearchResponse(BaseModel):
    documents: list[dict]

@router.post("/search", response_model=RAGSearchResponse)
def vector_search_rag(req: RAGSearchRequest):
    return RAGSearchResponse(
        documents=[
            {
                "id": "doc_crop_001",
                "title": "Integrated Pest Management for Cotton",
                "content": "Install yellow sticky traps @ 5-6 per acre for whitefly and aphid monitoring. Spray neem oil 1500ppm if nymph count exceeds ETL.",
                "score": 0.89,
            }
        ]
    )
