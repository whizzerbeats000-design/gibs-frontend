import re
import json

def analyze_css(css_text):
    # Extract clamp values
    clamps = re.findall(r'clamp\(([^)]+)\)', css_text)
    # Extract media queries
    media_queries = re.findall(r'@media\s*\(([^)]+)\)', css_text)
    return {"clamps": clamps, "media_queries": media_queries}

with open('src/index.css', 'r') as f:
    css = f.read()

print(json.dumps(analyze_css(css), indent=2))
