# /analysis/code_quality.py

import ast

class CodeQualityAnalyzer(ast.NodeVisitor):
    def __init__(self):
        self.issues = []

    def visit_FunctionDef(self, node):
        # Check for long function
        line_count = len(node.body)
        if line_count > 30:
            self.issues.append({
                'type': 'Long Function',
                'message': f"Function '{node.name}' is too long ({line_count} lines).",
                'line': node.lineno
            })

        # Check for too many arguments
        arg_count = len(node.args.args)
        if arg_count > 5:
            self.issues.append({
                'type': 'Too Many Arguments',
                'message': f"Function '{node.name}' has too many arguments ({arg_count}).",
                'line': node.lineno
            })

        self.generic_visit(node)

    def visit_If(self, node):
        depth = self._calculate_nesting_depth(node)
        if depth > 3:
            self.issues.append({
                'type': 'Deep Nesting',
                'message': f"Code block has deep nesting (depth={depth}).",
                'line': node.lineno
            })
        self.generic_visit(node)

    def visit_ExceptHandler(self, node):
        if not node.body:
            self.issues.append({
                'type': 'Empty Except Block',
                'message': "Empty 'except' block detected.",
                'line': node.lineno
            })

    def _calculate_nesting_depth(self, node, depth=0):
        """Recursively check max nesting depth within the node."""
        if not hasattr(node, 'body') or not isinstance(node.body, list):
            return depth
        max_depth = depth
        for child in node.body:
            if isinstance(child, (ast.If, ast.For, ast.While, ast.Try)):
                child_depth = self._calculate_nesting_depth(child, depth + 1)
                max_depth = max(max_depth, child_depth)
        return max_depth


def analyze_code(source_code: str):
    """Parses code and returns quality issues."""
    try:
        tree = ast.parse(source_code)
        analyzer = CodeQualityAnalyzer()
        analyzer.visit(tree)
        return analyzer.issues
    except SyntaxError as e:
        return [{'type': 'Syntax Error', 'message': str(e), 'line': e.lineno}]
