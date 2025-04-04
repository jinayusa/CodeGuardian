from code_quality import analyze_code
from security_scanner import run_bandit

# Test input file
file_path = 'test_input.py'

# Read code
with open(file_path, 'r') as f:
    code = f.read()

# Run quality scan
quality_issues = analyze_code(code)
for issue in quality_issues:
    print(f"[{issue['type']}] Line {issue['line']}: {issue['message']}")

# Run security scan
print("\n--- Bandit Security Scan ---")
security_issues = run_bandit(file_path)
for issue in security_issues:
    print(f"[{issue['type']}] Line {issue['line']}: {issue['message']} ({issue['severity']}, {issue['confidence']})")
