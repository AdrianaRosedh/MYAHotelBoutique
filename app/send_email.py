# app/send_email.py
import os
import base64
from googleapiclient.discovery import build
from .get_credentials import get_credentials  # Ensure this import is correct

def get_gmail_service():
    creds = get_credentials()
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
