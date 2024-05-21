import os
import requests
from flask import Flask, jsonify, request, make_response
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

CLOUDBEDS_CLIENT_ID = os.getenv("CLOUDBEDS_CLIENT_ID")
CLOUDBEDS_CLIENT_SECRET = os.getenv("CLOUDBEDS_CLIENT_SECRET")
CLOUDBEDS_API_URL = "https://hotels.cloudbeds.com/api/v1.1/"

app = Flask(__name__)

def get_access_token():
    token_url = f"{CLOUDBEDS_API_URL}/oauth/token"
    data = {
        'client_id': CLOUDBEDS_CLIENT_ID,
        'client_secret': CLOUDBEDS_CLIENT_SECRET,
        'grant_type': 'client_credentials'
    }
    try:
        response = requests.post(token_url, data=data)
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response.json().get('access_token')
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error getting access token: {e}")
        return None

@app.route('/')
def home():
    return "Welcome to the Flask Cloudbeds API Integration!"

@app.route('/search_availability', methods=['GET'])
def search_availability():
    access_token = get_access_token()
    if not access_token:
        return make_response(jsonify({'error': 'Unable to get access token'}), 500)

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return make_response(jsonify({'error': 'Missing required parameters: start_date and end_date'}), 400)
    
    api_endpoint = f"{CLOUDBEDS_API_URL}/roomAvailability"
    params = {
        'start_date': start_date,
        'end_date': end_date
    }
    try:
        response = requests.get(api_endpoint, headers=headers, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error fetching availability: {e}")
        return make_response(jsonify({'error': 'Error fetching availability'}), 500)

@app.route('/make_booking', methods=['POST'])
def make_booking():
    access_token = get_access_token()
    if not access_token:
        return make_response(jsonify({'error': 'Unable to get access token'}), 500)

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    data = request.get_json()
    if not data:
        return make_response(jsonify({'error': 'Missing booking data'}), 400)
    
    api_endpoint = f"{CLOUDBEDS_API_URL}/bookings"
    try:
        response = requests.post(api_endpoint, headers=headers, json=data)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error making booking: {e}")
        return make_response(jsonify({'error': 'Error making booking'}), 500)

@app.route('/cancel_booking', methods=['POST'])
def cancel_booking():
    access_token = get_access_token()
    if not access_token:
        return make_response(jsonify({'error': 'Unable to get access token'}), 500)

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    data = request.get_json()
    if not data or not data.get('booking_id'):
        return make_response(jsonify({'error': 'Missing booking_id'}), 400)
    
    booking_id = data.get('booking_id')
    api_endpoint = f"{CLOUDBEDS_API_URL}/bookings/{booking_id}/cancel"
    try:
        response = requests.post(api_endpoint, headers=headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error canceling booking: {e}")
        return make_response(jsonify({'error': 'Error canceling booking'}), 500)

if __name__ == '__main__':
    app.run(debug=True)
