import os
import pickle
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env file
dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

# Ensure environment variables are loaded
SCOPES = ['https://www.googleapis.com/auth/gmail.send']
CLIENT_SECRET_FILE = os.getenv("GMAIL_CLIENT_SECRET_FILE")

# Debugging print statements
print(f"Loaded .env from: {dotenv_path}")
print(f"CLIENT_SECRET_FILE: {CLIENT_SECRET_FILE}")

if not CLIENT_SECRET_FILE:
    raise ValueError("No client secret file specified. Ensure GMAIL_CLIENT_SECRET_FILE is set in the .env file.")

def main():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=58776)  # Specify a fixed port
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    print("Credentials saved to token.pickle")

if __name__ == '__main__':
    main()
