import openai
import os
from dotenv import load_dotenv  # ✅ <--- THIS is missing

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def analyze_ethics(code: str):
    try:
        prompt = f"""
You are a software ethics reviewer.

Analyze the following Python code snippet and list any ethical concerns such as:
- Biased logic (e.g., gender/race-based conditions)
- Unsafe practices (e.g., non-consensual data use)
- Discriminatory filters
- Surveillance or manipulation techniques
- Lack of fairness or transparency

Return results in this format:
[{{"type": "...", "message": "...", "line": <line_number>}}, ...]

Code to review:
{code}
"""

        response = openai.ChatCompletion.create(  # ✅ Correct for v1.x
            model="gpt-3.5-turbo",
            messages=[{
                "role": "user",
                "content": prompt
            }],
            temperature=0.3
        )

        return eval(response.choices[0].message.content)
    except Exception as e:
        return [{"type": "OpenAI Error", "message": str(e)}]
