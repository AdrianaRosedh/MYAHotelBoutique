from flask import Blueprint, request, jsonify
import requests, logging

bp = Blueprint("booking", __name__)

client_id = "CLOUDBEDS_CLIENT_ID"
client_secret = "CLOUDBEDS_CLIENT_SECRET"
token_url = "https://hotels.cloudbeds.com/api/v1.2/oauth/token"
reservation_url = "https://api.cloudbeds.com/api/v1.2/postReservation"

logging.basicConfig(level=logging.DEBUG)


def get_access_token():
    try:
        logging.debug("Requesting access token with client_id and client_secret")
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
        }
        response = requests.post(token_url, headers=headers, data=data)
        logging.debug(f"Token URL response status code: {response.status_code}")
        logging.debug(f"Token URL response content: {response.text}")
        response.raise_for_status()
        logging.debug("Access token obtained successfully")
        return response.json().get("access_token")
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to obtain access token: {str(e)}")
        if response:
            logging.error(f"Response status code: {response.status_code}")
            logging.error(f"Response content: {response.text}")
        return None


@bp.route("/booking", methods=["POST"])
def booking():
    try:
        data = request.json
        logging.debug(f"Received JSON data: {data}")

        required_fields = [
            "first_name",
            "last_name",
            "email",
            "checkin",
            "checkout",
            "guests",
        ]
        for field in required_fields:
            if field not in data:
                logging.error(f"Missing field: {field}")
                return jsonify(success=False, error=f"Missing field: {field}"), 400

        first_name = data["first_name"]
        last_name = data["last_name"]
        email = data["email"]
        checkin = data["checkin"]
        checkout = data["checkout"]
        guests = data["guests"]

        logging.debug(
            f"Extracted data: first_name={first_name}, last_name={last_name}, email={email}, checkin={checkin}, checkout={checkout}, guests={guests}"
        )

        access_token = get_access_token()
        if not access_token:
            logging.error("Unable to obtain access token")
            return jsonify(success=False, error="Unable to obtain access token"), 500

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
        reservation_data = {
            "propertyID": "YOUR_PROPERTY_ID",  # Replace with your actual property ID
            "sourceID": "YOUR_SOURCE_ID",  # Replace with your actual source ID
            "thirdPartyIdentifier": "YOUR_THIRD_PARTY_IDENTIFIER",  # Replace if applicable
            "startDate": checkin,
            "endDate": checkout,
            "guestFirstName": first_name,
            "guestLastName": last_name,
            "guestGender": "unspecified",  # Modify if necessary
            "guestCountry": "US",  # Modify with actual country code
            "guestZip": "12345",  # Modify with actual ZIP code
            "guestEmail": email,
            "guestPhone": "123-456-7890",  # Modify with actual phone number
            "estimatedArrivalTime": "15:00",  # Modify if necessary
            "rooms": [
                {
                    "roomTypeID": "YOUR_ROOM_TYPE_ID",  # Replace with actual room type ID
                    "quantity": "1",  # Modify based on the number of rooms
                }
            ],
            "adults": [
                {
                    "roomTypeID": "YOUR_ROOM_TYPE_ID",  # Replace with actual room type ID
                    "quantity": str(guests),  # Modify based on the number of adults
                }
            ],
            "children": [
                {
                    "roomTypeID": "YOUR_ROOM_TYPE_ID",  # Replace with actual room type ID
                    "quantity": "0",  # Modify based on the number of children
                }
            ],
            "paymentMethod": "credit",  # Modify if necessary
            "cardToken": "YOUR_CARD_TOKEN",  # Replace if applicable
            "paymentAuthorizationCode": "YOUR_AUTHORIZATION_CODE",  # Replace if applicable
        }

        logging.debug(f"Sending reservation data: {reservation_data}")
        response = requests.post(
            reservation_url, headers=headers, json=reservation_data
        )
        logging.debug(f"Reservation URL response status code: {response.status_code}")
        logging.debug(f"Reservation URL response content: {response.text}")
        response.raise_for_status()

        logging.debug("Reservation created successfully")
        return jsonify(success=True)
    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error occurred: {http_err.response.content}")
        return (
            jsonify(success=False, error=str(http_err)),
            http_err.response.status_code,
        )
    except Exception as e:
        logging.error(f"Error processing booking: {str(e)}")
        return jsonify(success=False, error=str(e)), 400
