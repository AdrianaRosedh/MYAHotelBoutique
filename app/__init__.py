import os
import base64
from flask import Flask, request, session, render_template
from flask_babel import Babel
from dotenv import load_dotenv
from datetime import datetime, timedelta
from flask_sitemap import Sitemap
from flask_compress import Compress
from flask_caching import Cache

# Load environment variables from .env file
load_dotenv()

def decode_and_write_file(encoded_data, output_path):
    with open(output_path, 'wb') as file:
        file.write(base64.b64decode(encoded_data))

# Decode and write client_secret.json
client_secret_base64 = os.getenv('CLIENT_SECRET_BASE64')
if client_secret_base64:
    decode_and_write_file(client_secret_base64, 'client_secret.json')

# Decode and write token.pickle
token_base64 = os.getenv('TOKEN_BASE64')
if token_base64:
    decode_and_write_file(token_base64, 'token.pickle')

def get_locale():
    return session.get("language", request.accept_languages.best_match(["en", "es"]))

def get_timezone():
    return "UTC"

def create_app():
    app = Flask(__name__)

    # Print environment variable for debugging
    print(f"FLASK_ENV: {os.getenv('FLASK_ENV')}")

    # Configuration
    app.config["BABEL_DEFAULT_LOCALE"] = "en"
    app.config["BABEL_DEFAULT_TIMEZONE"] = "UTC"
    app.secret_key = os.getenv("SECRET_KEY", "you-will-never-guess")

    # Gmail API configuration
    app.config["GMAIL_CLIENT_SECRET_FILE"] = 'client_secret.json'
    app.config["GMAIL_SCOPES"] = [os.getenv("GMAIL_SCOPES")]
    app.config["GMAIL_USER"] = os.getenv("GMAIL_USER")
    app.config["MAIL_TO"] = os.getenv("MAIL_TO")

    # Enable compression
    Compress(app)

    # Configure caching
    cache = Cache(app, config={'CACHE_TYPE': 'simple'})
    cache.init_app(app)

    # Initialize Babel
    babel = Babel(app, locale_selector=get_locale, timezone_selector=get_timezone)

    # Initialize Flask-Sitemap
    sitemap = Sitemap(app)

    # Register Blueprints
    from .routes import bp as main_bp
    app.register_blueprint(main_bp)

    from .chatbot_routes import bp as chatbot_bp
    app.register_blueprint(chatbot_bp, url_prefix='/chatbot')

    @app.before_request
    def set_default_language():
        if "language" not in session:
            session["language"] = request.accept_languages.best_match(
                ["en", "es"], default="en"
            )

    @app.context_processor
    def inject_locale():
        return {"locale": get_locale()}

    @app.context_processor
    def inject_dates():
        today = datetime.today().strftime("%Y-%m-%d")
        tomorrow = (datetime.today() + timedelta(days=1)).strftime("%Y-%m-%d")
        return {"today": today, "tomorrow": tomorrow}

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("custom_404.html"), 404

    @app.after_request
    def add_cache_headers(response):
        if 'maps.googleapis.com' in request.url:
            response.headers['Cache-Control'] = 'public, max-age=86400'  # 1 day
        elif 'cdn.jsdelivr.net' in request.url:
            response.headers['Cache-Control'] = 'public, max-age=604800'  # 7 days
        elif 'hammerjs.github.io' in request.url:
            response.headers['Cache-Control'] = 'public, max-age=86400'  # 1 day
        return response

    # Register sitemap generators
    register_sitemap_generators(app)

    return app

def register_sitemap_generators(app):
    sitemap = app.extensions['sitemap']

    @sitemap.register_generator
    def index():
        yield 'main.index', {}

    @sitemap.register_generator
    def index_localized():
        languages = ['en', 'es']
        for lang in languages:
            yield 'main.index_localized', {'lang_code': lang}

    @sitemap.register_generator
    def oliveafarmtotable():
        languages = ['en', 'es']
        for lang in languages:
            yield 'main.oliveafarmtotable', {'lang_code': lang}

    @sitemap.register_generator
    def divino():
        languages = ['en', 'es']
        for lang in languages:
            yield 'main.divino', {'lang_code': lang}

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)