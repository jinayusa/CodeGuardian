from models.ethics_checker import analyze_ethics

@app.post("/analyze/")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".py")
    temp_file.write(contents)
    temp_file.close()

    code_str = contents.decode("utf-8")

    # Run modules
    quality_issues = analyze_code(code_str)
    security_issues = run_bandit(temp_file.name)
    ethics_issues = analyze_ethics(code_str)

    return JSONResponse(content={
        "quality_issues": quality_issues,
        "security_issues": security_issues,
        "ethics_issues": ethics_issues
    })
