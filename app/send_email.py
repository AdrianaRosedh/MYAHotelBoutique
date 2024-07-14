# app/send_email.py
import os
import pickle
import base64
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
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
    # Ensure the base64 string is correctly padded
    missing_padding = len(client_secret_base64) % 4
    if missing_padding:
        client_secret_base64 += '=' * (4 - missing_padding)
    
    try:
        with open(CLIENT_SECRET_FILE, 'wb') as f:
            f.write(base64.b64decode(client_secret_base64))
    except base64.binascii.Error as e:
        raise ValueError(f"Invalid base64-encoded string for client secret: {str(e)}")

# Decode and save the token pickle file
token_pickle_base64 = os.getenv('TOKEN_PICKLE_BASE64')
if token_pickle_base64:
    # Ensure the base64 string is correctly padded
    missing_padding = len(token_pickle_base64) % 4
    if missing_padding:
        token_pickle_base64 += '=' * (4 - missing_padding)
    
    try:
        with open(TOKEN_PICKLE_FILE, 'wb') as f:
            f.write(base64.b64decode(token_pickle_base64))
    except base64.binascii.Error as e:
        raise ValueError(f"Invalid base64-encoded string for token pickle: {str(e)}")

def get_gmail_service():
    creds = None
    if os.path.exists(TOKEN_PICKLE_FILE):
        with open(TOKEN_PICKLE_FILE, 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_PICKLE_FILE, 'wb') as token:
            pickle.dump(creds, token)
    service = build('gmail', 'v1', credentials=creds)
    return service

def send_email(to, subject, message_text):
    service = get_gmail_service()
    message = create_message(os.getenv('GMAIL_USER'), to, subject, message_text)
    send_message(service, 'me', message)

def create_message(sender, to, subject, message_text):
    from email.mime.text import MIMEText
    import base64

    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw}

def send_message(service, user_id, message):
    try:
        message = service.users().messages().send(userId=user_id, body=message).execute()
        print(f'Message Id: {message["id"]}')
        return message
    except Exception as error:
        print(f'An error occurred: {error}')