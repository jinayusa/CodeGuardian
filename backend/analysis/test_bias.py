# /analysis/test_bias.py

def recommend_loan(user):
    if user["gender"] == "female":
        return False  # Women are riskier
    return True
