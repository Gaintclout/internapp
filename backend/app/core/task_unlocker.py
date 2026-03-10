def generate_initial_tasks(internship_type: str):
    if internship_type == "fasttrack":
        return [ {"seq": 1, "unlocked": True} ]

    if internship_type == "days45":
        return [
             {"seq": i, "unlocked": True if i == 1 else False}
             for i in range(1, 4) 
        ]
    if internship_type == "semester4m":
        return [
            {"seq": i, "unlocked": True if i == 1 else False}
            for i in range(1, 9)
        ]
