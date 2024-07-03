import os
import pickle
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env file
dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

# Ensure environment variables are loaded
GMAIL_USER = os.getenv("GMAIL_USER")

def get_gmail_service():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        raise Exception("The credentials are not valid. Please run get_credentials.py to obtain valid credentials.")
    service = build('gmail', 'v1', credentials=creds)
    return service

def send_email(to, subject, message_text):
    service = get_gmail_service()
    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = GMAIL_USER
    message['subject'] = subject
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
    body = {'raw': raw_message}
    message = (service.users().messages().send(userId="me", body=body).execute())
    print(f"Message Id: {message['id']}")
