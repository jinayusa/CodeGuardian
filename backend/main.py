from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tempfile

app = FastAPI()

# ✅ Enable CORS for frontend access (localhost:5173 is Vite default)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Toggle mock mode for frontend testing
USE_MOCK = True

@app.post("/analyze/")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()
    code_str = contents.decode("utf-8")

    # Save uploaded file to temp location
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".py")
    temp_file.write(contents)
    temp_file.close()

    if USE_MOCK:
        # ✅ Return MOCKED results for dev/testing
        quality_issues = [
            {"type": "Style", "message": "Line too long", "line": 8},
            {"type": "Convention", "message": "Variable name should be lowercase", "line": 12}
        ]
        security_issues = [
            {"type": "Security Issue (B506)", "message": "Use of unsafe yaml.load", "line": 10}
        ]
        ethics_issues = [
            {"type": "Bias", "message": "Gender-based logic", "line": 23},
            {"type": "Privacy", "message": "Accessing location without consent", "line": 35}
        ]
    else:
        # ✅ Use real analysis modules
        from analysis.code_quality import analyze_code
        from models.ethics_checker import analyze_ethics
        from security.bandit_analysis import run_bandit

        quality_issues = analyze_code(code_str)
        security_issues = run_bandit(temp_file.name)
        ethics_issues = analyze_ethics(code_str)

    return JSONResponse(content={
        "quality_issues": quality_issues,
        "security_issues": security_issues,
        "ethics_issues": ethics_issues
    })
