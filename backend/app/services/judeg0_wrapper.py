import requests, json

JUDGE0_URL = "http://localhost:2358/submissions?base64_encoded=false&wait=true"

def run_judge0(source_code: str, language_id: int, visible_tests: list):
    results = []

    for t in visible_tests:
        payload = {
            "source_code": source_code,
            "language_id": language_id,
            "stdin": t["input"]
        }
        r = requests.post(JUDGE0_URL, json=payload)
        result = r.json()

        results.append({
            "input": t["input"],
            "expected": t["expected_output"],
            "actual": result.get("stdout") or result.get("stderr"),
            "status": "pass" if result.get("stdout","").strip()==t["expected_output"] else "fail"
        })

    return results
