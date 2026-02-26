# # """
# # Database Configuration
# # SQLAlchemy setup and session management
# # """

# # from sqlalchemy import create_engine
# # from sqlalchemy.ext.declarative import declarative_base
# # from sqlalchemy.orm import sessionmaker
# # from app.config import settings

# # # Database URL
# # # Format: postgresql://username:password@host:port/database
# # DATABASE_URL = "postgresql://postgres:heydata@localhost:5432/dsa_platform"

# # # Create engine
# # engine = create_engine(
# #     DATABASE_URL,
# #     pool_pre_ping=True,
# #     echo=True if settings.DEBUG else False
# # )

# # # Session factory
# # SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # # Base class for models
# # Base = declarative_base()


# # # Dependency for FastAPI routes
# # def get_db():
# #     """
# #     Get database session
# #     Use as dependency in FastAPI routes
# #     """
# #     db = SessionLocal()
# #     try:
# #         yield db
# #     finally:
# #         db.close()

# """
# Database Configuration
# SQLAlchemy setup and session management
# """

# import os
# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# from app.config import settings

# # Database URL — uses Railway's DATABASE_URL in production, falls back to local
# DATABASE_URL = os.environ.get(
#     "DATABASE_URL",
#     "postgresql://postgres:heydata@localhost:5432/dsa_platform"
# )

# # Railway gives postgres:// but SQLAlchemy needs postgresql://
# if DATABASE_URL.startswith("postgres://"):
#     DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# # Create engine
# engine = create_engine(
#     DATABASE_URL,
#     pool_pre_ping=True,
#     echo=True if settings.DEBUG else False
# )

# # Session factory
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Base class for models
# Base = declarative_base()


# # Dependency for FastAPI routes
# def get_db():
#     """
#     Get database session
#     Use as dependency in FastAPI routes
#     """
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()  
import firebase_admin
from firebase_admin import credentials, db
import os
import json

def initialize_firebase():
    if not firebase_admin._apps:
        firebase_creds = os.environ.get("FIREBASE_CREDENTIALS")
        database_url = os.environ.get("FIREBASE_DATABASE_URL")
        
        if firebase_creds:
            cred_dict = json.loads(firebase_creds)
            cred = credentials.Certificate(cred_dict)
        else:
            # Local development — use the JSON file directly
            cred = cred = credentials.Certificate("H:/DataStructure/DSA/database/test-slashcoder-20a45-firebase-adminsdk-fbsvc-99f93e94d0.json")
            database_url = "https://test-slashcoder-20a45-default-rtdb.firebaseio.com"
        
        firebase_admin.initialize_app(cred, {
            "databaseURL": database_url
        })

initialize_firebase()

def get_db():
    return db.reference("/")