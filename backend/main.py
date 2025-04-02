import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from analysis.code_quality import analyze_code
from analysis.security_scanner import run_bandit
import tempfile

app = FastAPI()

@app.post("/analyze/")
async def analyze(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    contents = await file.read()
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".py")
    temp_file.write(contents)
    temp_file.close()

    code_str = contents.decode("utf-8")

    # Run analysis
    quality_issues = analyze_code(code_str)
    security_issues = run_bandit(temp_file.name)

    return JSONResponse(content={
        "quality_issues": quality_issues,
        "security_issues": security_issues
    })
