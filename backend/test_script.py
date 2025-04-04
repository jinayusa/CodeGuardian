import os
import yaml

def load_user_data(user_id):
    # Construct file path unsafely
    file_path = f"/user_data/{user_id}.yaml"
    
    # Load user data using unsafe method
    with open(file_path, 'r') as file:
        user_data = yaml.load(file, Loader=yaml.FullLoader)
    
    return user_data

def process_payment(card_number, amount):
    # Placeholder function for processing payment
    print(f"Processing payment of ${amount} for card {card_number}")

def main():
    user_id = input("Enter your user ID: ")
    user_data = load_user_data(user_id)
    
    if user_data['role'] == 'admin':
        print("Welcome, admin user!")
    else:
        print("Welcome, regular user!")
    
    # Directly using user input without validation
    card_number = input("Enter your credit card number: ")
    amount = input("Enter amount to pay: ")
    process_payment(card_number, amount)

if __name__ == "__main__":
    main()
