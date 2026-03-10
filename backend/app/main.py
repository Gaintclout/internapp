# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import init_db
from fastapi.openapi.utils import get_openapi
from fastapi.security import HTTPBearer

# Routers
# from app.routes.auth_routes import router as auth_router

from app.routers import auth, students, projects, payments, tasks
from app.routers import certificates, admin, mentors
from app.routers import project_auto_split, fortnight_feedback, chatbot, debug
from app.routers.files import router as files_router
from app.routers.projects import router as projects_router
from app.routers.vscode_similarity import router as vscode_similarity_router


from app.routers import vscode_context, vscode_submit, vscode_token
from app.routers import oauth_login
from app.routers.vscode import router as vscode_router
from app.routers.vscode_authorize import router as vscode_authorize_router
from dotenv import load_dotenv
load_dotenv()
app = FastAPI(debug=True, title="Interns App Backend", version="1.0.0")

# For documentation only (not used in auth)
bearer_scheme = HTTPBearer()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers


app.include_router(auth.router)
app.include_router(students.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(payments.router)
app.include_router(certificates.router)
app.include_router(admin.router)
app.include_router(mentors.router)
app.include_router(project_auto_split.router)
app.include_router(fortnight_feedback.router)
app.include_router(chatbot.router)
app.include_router(oauth_login.router)
app.include_router(debug.router)
app.include_router(files_router)
app.include_router(projects_router)
app.include_router(vscode_context.router)
app.include_router(vscode_submit.router)
app.include_router(vscode_token.router)
app.include_router(vscode_router)
app.include_router(vscode_authorize_router)
app.include_router(vscode_similarity_router)


# -------------------------------------------------------
# ⭐ FIXED CUSTOM OPENAPI — BearerAuth + OAuth2 Password
# -------------------------------------------------------
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        routes=app.routes,
    )

    # Ensure sections exist
    openapi_schema.setdefault("components", {})
    openapi_schema["components"].setdefault("securitySchemes", {})

    # ⭐ Add JWT BearerAuth
    openapi_schema["components"]["securitySchemes"]["BearerAuth"] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
    }

    # ⭐ Add OAuth2 flows for login
    openapi_schema["components"]["securitySchemes"].update({
        "OAuth2_user": {
            "type": "oauth2",
            "flows": {"password": {"tokenUrl": "/auth/login", "scopes": {}}}
        },
        "OAuth2_mentor": {
            "type": "oauth2",
            "flows": {"password": {"tokenUrl": "/auth/login-mentor", "scopes": {}}}
        },
        "OAuth2_admin": {
            "type": "oauth2",
            "flows": {"password": {"tokenUrl": "/auth/login-admin", "scopes": {}}}
        },
    })


    

    # ⭐ Apply BearerAuth globally for all endpoints
    for path in openapi_schema.get("paths", {}):
        for method in openapi_schema["paths"][path]:
            existing = openapi_schema["paths"][path][method].get("security", [])
            existing.append({"BearerAuth": []})
            openapi_schema["paths"][path][method]["security"] = existing

    app.openapi_schema = openapi_schema
    return openapi_schema


# Apply OpenAPI override
app.openapi = custom_openapi


# Startup
@app.on_event("startup")
def on_startup():
    init_db()


# Health Check
@app.get("/health")
def health():
    return {"status": "ok"}
