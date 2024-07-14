# app/send_email.py
import os
import pickle
import base64
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from dotenv import load_dotenv, find_dotenv
from google.auth.exceptions import RefreshError
from flask import current_app
from app.get_credentials import get_credentials  # Correct import statement

# Load environment variables from .env file
dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

def get_gmail_service():
    creds = get_credentials()
    service = build('gmail', 'v1', credentials=creds)
    return service

def send_email(to, subject, message_text):
    try:
        service = get_gmail_service()
        message = create_message(os.getenv('GMAIL_USER'), to, subject, message_text)
        send_message(service, 'me', message)
    except RefreshError as e:
        current_app.logger.error(f"Error refreshing token: {e}")
        reauthenticate()
        raise
    except Exception as e:
        current_app.logger.error(f"An error occurred while sending email: {e}")
        raise

def reauthenticate():
    try:
        creds = get_credentials()
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
        current_app.logger.info("Re-authentication successful and new token saved.")
    except Exception as e:
        current_app.logger.error(f"Error during reauthentication: {e}")
        raise

def create_message(sender, to, subject, message_text):
    from email.mime.text import MIMEText
    import base64

    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    try:
        raw = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
    except UnicodeDecodeError as e:
        current_app.logger.error(f"Error encoding message to base64: {e}")
        raw = base64.urlsafe_b64encode(message.as_bytes()).decode('latin1')  # Fallback encoding
    return {'raw': raw}

def send_message(service, user_id, message):
    try:
        message = service.users().messages().send(userId=user_id, body=message).execute()
        current_app.logger.info(f'Message Id: {message["id"]}')
        return message
    except Exception as error:
        current_app.logger.error(f'An error occurred: {error}')
        raise
