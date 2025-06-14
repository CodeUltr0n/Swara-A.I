import re as re

def extract_yt_term(command):
    pattern = r'play\s+(.*?)\s+on\s+youtube'
    match = re.search(pattern, command, re.IGNORECASE)
    
    if match:
        return match.group(1)
    else:
        return command  # fallback if pattern not matched