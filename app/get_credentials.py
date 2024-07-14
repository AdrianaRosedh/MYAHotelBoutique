# app/get_credentials.py
import os
import pickle
import base64
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env file
dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

# Ensure environment variables are loaded
SCOPES = os.getenv('GMAIL_SCOPES').split(',')
CLIENT_SECRET_FILE = 'client_secret.json'
TOKEN_PICKLE_FILE = 'token.pickle'

# Decode and save the client secret json file
client_secret_base64 = os.getenv('GMAIL_CLIENT_SECRET_BASE64')
if client_secret_base64:
    with open(CLIENT_SECRET_FILE, 'wb') as f:
        f.write(base64.b64decode(client_secret_base64))

def get_credentials():
    creds = None
    if os.path.exists(TOKEN_PICKLE_FILE):
        try:
            with open(TOKEN_PICKLE_FILE, 'rb') as token:
                creds = pickle.load(token)
        except Exception as e:
            print(f"Error loading token pickle: {e}")
            creds = None
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except Exception as e:
                print(f"Error refreshing token: {e}")
                creds = None  # Force reauthentication
        if not creds or not creds.valid:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
            with open(TOKEN_PICKLE_FILE, 'wb') as token:
                pickle.dump(creds, token)
            print("Credentials saved to token.pickle")
    
    return creds

if __name__ == '__main__':
    creds = get_credentials()
    print("Credentials obtained")
