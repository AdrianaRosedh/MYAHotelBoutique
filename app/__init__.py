from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.secret_key = os.getenv('SECRET_KEY', 'your_default_secret_key')  # Ensure the secret key is set for sessions

    with app.app_context():
        from . import routes
        app.register_blueprint(routes.bp)

    return app
