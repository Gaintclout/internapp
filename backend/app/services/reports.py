from datetime import date, timedelta

def fortnight_windows(start: date, internship_type: str):
    total_days = 45 if internship_type == "days45" else 120 if internship_type == "semester4m" else 30
    wins = []
    i = 1
    while (i - 1) * 15 < total_days:
        s = start + timedelta(days=(i - 1) * 15)
        e = start + timedelta(days=min(i * 15, total_days))
        wins.append({"index": i, "start": s, "end": e})
        i += 1
    return wins
