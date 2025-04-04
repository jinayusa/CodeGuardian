import subprocess
import json

def run_bandit(file_path: str):
    try:
        result = subprocess.run(
            ['bandit', file_path, '-f', 'json'],  # Removed '-r'
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False  # Allow non-zero exit
        )
        if result.returncode not in (0, 1):  # 1 = issues found, 0 = clean
            return [{"type": "Bandit Error", "message": result.stderr.strip(), "line": None}]
        
        output = json.loads(result.stdout)
        issues = []
        for issue in output.get("results", []):
            issues.append({
                "type": f"Security Issue ({issue.get('test_id')})",
                "message": issue.get("issue_text"),
                "line": issue.get("line_number")
            })
        return issues
    except Exception as e:
        return [{"type": "Bandit Error", "message": str(e), "line": None}]
