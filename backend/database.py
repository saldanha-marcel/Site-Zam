from sqlalchemy import create_engine, Column, Integer, String, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import psycopg2
from psycopg2 import sql
import os
import dotenv
# Load environment variables from .env file
dotenv.load_dotenv()

def create_database_if_not_exists():
    try:
        # Connect to postgres database to check/create the target database
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database="postgres"
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(sql.SQL("SELECT 1 FROM pg_database WHERE datname = %s"), [os.getenv("DB_NAME")])
        exists = cursor.fetchone()
        
        if not exists:
            # Create database
            cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(os.getenv("DB_NAME"))))
            print(f"Database '{os.getenv("DB_NAME")}' created successfully.")
        else:
            print(f"Database '{os.getenv("DB_NAME")}' already exists.")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error creating database: {e}")
        raise

# Create database if it doesn't exist
create_database_if_not_exists()

# Now connect to the target database
DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
engine = create_engine(DATABASE_URL)
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    idade = Column(Integer)
    cidade = Column(String)
    telefone = Column(String)
    email = Column(String)
    objetivo = Column(String)

# Create tables
Base.metadata.create_all(bind=engine)
print("Tables created successfully.")