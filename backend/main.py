from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    pool_timeout=30,
    pool_recycle=1800
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Database Models
class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    idade = Column(Integer)
    cidade = Column(String)
    telefone = Column(String)
    email = Column(String)
    objetivo = Column(String)


Base.metadata.create_all(bind=engine)


# Pydantic Models
class LeadCreate(BaseModel):
    nome: str = Field(..., min_length=3, max_length=100)
    idade: int = Field(..., ge=12, le=120)
    cidade: str = Field(..., min_length=2, max_length=100)
    telefone: str
    email: str
    objetivo: str


class LeadResponse(BaseModel):
    id: int
    nome: str
    idade: int
    cidade: str
    telefone: str
    email: str
    objetivo: str

    class Config:
        from_attributes = True


class CreateLeadResponse(BaseModel):
    message: str
    lead: LeadResponse


# FastAPI App
app = FastAPI(title="ZAM API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Routes
@app.post("/leads", response_model=CreateLeadResponse)
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    try:
        new_lead = Lead(**lead.dict())
        db.add(new_lead)
        db.commit()
        db.refresh(new_lead)
        
        return {
            "message": "Lead criado com sucesso!",
            "lead": new_lead
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao criar lead: {str(e)}")


@app.get("/leads", response_model=list[LeadResponse])
def get_leads(db: Session = Depends(get_db)):
    return db.query(Lead).all()


@app.get("/leads/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead não encontrado")
    return lead