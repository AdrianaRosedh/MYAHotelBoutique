import os
import pickle
import base64
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env file
dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

# Ensure environment variables are loaded
GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_CLIENT_SECRET_FILE = os.getenv("GMAIL_CLIENT_SECRET_FILE")
GMAIL_SCOPES = [os.getenv("GMAIL_SCOPES")]

def get_gmail_service():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    else:
        raise Exception("The credentials are not valid. Please run get_credentials.py to obtain valid credentials.")

    service = build('gmail', 'v1', credentials=creds)
    return service

def send_email(to, subject, message_text):
    try:
        service = get_gmail_service()
        message = MIMEText(message_text)
        message['to'] = to
        message['from'] = GMAIL_USER
        message['subject'] = subject
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
        body = {'raw': raw_message}
        sent_message = service.users().messages().send(userId="me", body=body).execute()
        print(f"Message Id: {sent_message['id']} created and sent to {to}")
        return sent_message['id']
    except Exception as e:
        print(f"Error sending email: {e}")
        return None

# Testing the email function
if __name__ == '__main__':
    to_email = os.getenv("MAIL_TO")
    subject = "Test Email from noreply@myahotelboutique.com"
    message_text = "This is a test email sent from noreply@myahotelboutique.com"
    send_email(to_email, subject, message_text)
