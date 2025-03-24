from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import balance_sheet

app = FastAPI(title="Show Me The Money API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(balance_sheet.router, prefix="/api/balance-sheet", tags=["balance-sheet"])

@app.get("/")
async def root():
    return {"message": "Welcome to Show Me The Money API"} 