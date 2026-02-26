

# # """
# # FastAPI Application Entry Point
# # DSA Coding Assessment Platform Backend
# # """

# # import sys
# # import asyncio

# # # Fix for Windows asyncio subprocess support
# # if sys.platform == 'win32':
# #     asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# # from fastapi import FastAPI
# # from fastapi.middleware.cors import CORSMiddleware
# # from app.config import settings
# # from app.routes import teacher
# # from app.routes import health_router, execute_router
# # from app.routes.auth import router as auth_router

# # # Create FastAPI application
# # app = FastAPI(
# #     title=settings.APP_NAME,
# #     version=settings.APP_VERSION,
# #     description="Backend API for DSA Coding Assessment Platform",
# #     docs_url="/docs",
# #     redoc_url="/redoc"
# # )

# # # Configure CORS
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # Register routes
# # app.include_router(health_router, tags=["Health"])
# # app.include_router(execute_router, prefix="/api", tags=["Code Execution"])
# # app.include_router(teacher.router)
# # app.include_router(auth_router)   # ✅ NEW: auth routes


# # @app.on_event("startup")
# # async def startup_event():
# #     print("=" * 60)
# #     print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION}")
# #     print("=" * 60)
# #     print(f"📍 Server running on: http://{settings.HOST}:{settings.PORT}")
# #     print(f"📚 API Docs: http://{settings.HOST}:{settings.PORT}/docs")
# #     print(f"🔧 Debug Mode: {settings.DEBUG}")
# #     print(f"🌐 CORS Enabled for: {', '.join(settings.ALLOWED_ORIGINS)}")
# #     print(f"💻 Supported Languages: {', '.join(settings.SUPPORTED_LANGUAGES)}")
# #     print(f"⏱️  Default Time Limit: {settings.DEFAULT_TIME_LIMIT_MS}ms")
# #     print(f"🐳 Docker Sandbox: {'Enabled' if settings.ENABLE_DOCKER_SANDBOX else 'Disabled (using local execution)'}")
# #     print(f"🪟 Platform: {sys.platform}")
# #     print(f"🔐 Auth: JWT enabled")
# #     print("=" * 60)


# # @app.on_event("shutdown")
# # async def shutdown_event():
# #     print("\n" + "=" * 60)
# #     print("🛑 Shutting down DSA Assessment Platform...")
# #     print("=" * 60)


# # @app.get("/")
# # async def root():
# #     return {
# #         "message": "Welcome to DSA Coding Assessment Platform API",
# #         "version": settings.APP_VERSION,
# #         "docs": "/docs",
# #         "health": "/ping"
# #     }


# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run(
# #         "app.main:app",
# #         host=settings.HOST,
# #         port=settings.PORT,
# #         reload=settings.DEBUG
# #     )

# """
# FastAPI Application Entry Point
# DSA Coding Assessment Platform Backend
# """

# import sys
# import asyncio

# # Fix for Windows asyncio subprocess support
# if sys.platform == 'win32':
#     asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.config import settings
# from app.routes import teacher
# from app.routes import health_router, execute_router
# from app.routes.auth import router as auth_router

# # Create FastAPI application
# app = FastAPI(
#     title=settings.APP_NAME,
#     version=settings.APP_VERSION,
#     description="Backend API for DSA Coding Assessment Platform",
#     docs_url="/docs",
#     redoc_url="/redoc"
# )

# # Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],          # ← keep as * until Netlify URL is known
#     allow_credentials=False,      # ← MUST be False when allow_origins=["*"]
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "https://testslashcoder.netlify.app",
#         "https://thriving-hamster-86353b.netlify.app",
#         "https://test.slashcoder.in",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # Register routes
# app.include_router(health_router, tags=["Health"])
# app.include_router(execute_router, prefix="/api", tags=["Code Execution"])
# app.include_router(teacher.router)
# app.include_router(auth_router)


# @app.on_event("startup")
# async def startup_event():
#     print("=" * 60)
#     print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION}")
#     print("=" * 60)
#     print(f"📍 Server running on: http://{settings.HOST}:{settings.PORT}")
#     print(f"📚 API Docs: http://{settings.HOST}:{settings.PORT}/docs")
#     print(f"🔧 Debug Mode: {settings.DEBUG}")
#     print(f"🌐 CORS: allowing all origins (*)")
#     print(f"💻 Supported Languages: {', '.join(settings.SUPPORTED_LANGUAGES)}")
#     print(f"⏱️  Default Time Limit: {settings.DEFAULT_TIME_LIMIT_MS}ms")
#     print(f"🐳 Docker Sandbox: {'Enabled' if settings.ENABLE_DOCKER_SANDBOX else 'Disabled (using local execution)'}")
#     print(f"🪟 Platform: {sys.platform}")
#     print(f"🔐 Auth: JWT enabled")
#     print("=" * 60)


# @app.on_event("shutdown")
# async def shutdown_event():
#     print("\n" + "=" * 60)
#     print("🛑 Shutting down DSA Assessment Platform...")
#     print("=" * 60)


# @app.get("/")
# async def root():
#     return {
#         "message": "Welcome to DSA Coding Assessment Platform API",
#         "version": settings.APP_VERSION,
#         "docs": "/docs",
#         "health": "/ping"
#     }


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(
#         "app.main:app",
#         host=settings.HOST,
#         port=settings.PORT,
#         reload=settings.DEBUG
#     )



"""
FastAPI Application Entry Point
DSA Coding Assessment Platform Backend
"""

import sys
import asyncio

# Fix for Windows asyncio subprocess support
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import teacher
from app.routes import health_router, execute_router
from app.routes.auth import router as auth_router
from app.database import initialize_firebase

# Initialize Firebase on startup
initialize_firebase()

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for DSA Coding Assessment Platform",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://testslashcoder.netlify.app",
        "https://thriving-hamster-86353b.netlify.app",
        "https://test.slashcoder.in",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health_router, tags=["Health"])
app.include_router(execute_router, prefix="/api", tags=["Code Execution"])
app.include_router(teacher.router)
app.include_router(auth_router)


@app.on_event("startup")
async def startup_event():
    print("=" * 60)
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION}")
    print("=" * 60)
    print(f"📍 Server running on: http://{settings.HOST}:{settings.PORT}")
    print(f"📚 API Docs: http://{settings.HOST}:{settings.PORT}/docs")
    print(f"🔧 Debug Mode: {settings.DEBUG}")
    print(f"💻 Supported Languages: {', '.join(settings.SUPPORTED_LANGUAGES)}")
    print(f"⏱️  Default Time Limit: {settings.DEFAULT_TIME_LIMIT_MS}ms")
    print(f"🔐 Auth: JWT enabled")
    print(f"🔥 Firebase: Realtime Database connected")
    print("=" * 60)


@app.on_event("shutdown")
async def shutdown_event():
    print("\n" + "=" * 60)
    print("🛑 Shutting down DSA Assessment Platform...")
    print("=" * 60)


@app.get("/")
async def root():
    return {
        "message": "Welcome to DSA Coding Assessment Platform API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/ping"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )