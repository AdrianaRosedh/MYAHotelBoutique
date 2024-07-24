import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

def main():
    scopes = ['https://www.googleapis.com/auth/gmail.send']
    creds = None

    # Load client secrets from a file
    flow = InstalledAppFlow.from_client_secrets_file(
        os.getenv("GMAIL_CLIENT_SECRET_FILE"), scopes)

    # Run the local server to get the authorization code
    creds = flow.run_local_server(port=63962)

    # Save the credentials for the next run
    with open('/Users/adrianarosediaz/Desktop/MYAHotelBoutique/secrets/token.pickle', 'wb') as token:
        pickle.dump(creds, token)

    print("Credentials obtained and stored in 'token.pickle'")

if __name__ == '__main__':
    main()
