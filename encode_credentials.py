import base64
import os

def encode_file(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return None
    with open(file_path, 'rb') as file:
        encoded = base64.b64encode(file.read()).decode('utf-8')
    return encoded

# Provide the correct path to your client_secret.json and token.pickle files
client_secret_base64 = encode_file('/Users/adrianarosediaz/Desktop/MYAHotelBoutique/secrets/client_secret.json')
token_base64 = encode_file('/Users/adrianarosediaz/Desktop/MYAHotelBoutique/secrets/token.pickle')  # Ensure the correct path to token.pickle

if client_secret_base64:
    print(f'CLIENT_SECRET_BASE64={client_secret_base64}')
else:
    print("Error: Failed to encode client_secret.json")

if token_base64:
    print(f'TOKEN_BASE64={token_base64}')
else:
    print("Error: Failed to encode token.pickle or file not found")
