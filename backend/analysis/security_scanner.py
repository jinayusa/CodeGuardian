# /analysis/security_scanner.py

import subprocess
import json

def run_bandit(filepath: str):
    try:
        # Run Bandit on the given file and get JSON output
        result = subprocess.run(
            ['bandit', '-f', 'json', '-q', filepath],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        output = json.loads(result.stdout)
        issues = []
        for issue in output.get("results", []):
            issues.append({
                "type": f"Security Issue ({issue.get('test_id')})",
                "message": issue.get("issue_text"),
                "severity": issue.get("issue_severity"),
                "confidence": issue.get("issue_confidence"),
                "line": issue.get("line_number"),
                "filename": issue.get("filename")
            })
        return issues
    except Exception as e:
        return [{"type": "Bandit Error", "message": str(e)}]
