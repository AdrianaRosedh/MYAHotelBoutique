# app/__init__.py
import os
from flask import Flask, request, session, render_template
from flask_babel import Babel
from dotenv import load_dotenv
from datetime import datetime, timedelta
from flask_sitemap import Sitemap
from flask_compress import Compress
from flask_caching import Cache
from flask_talisman import Talisman

# Load environment variables from .env file
load_dotenv()

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
    app.config["GMAIL_CLIENT_SECRET_FILE"] = os.getenv("GMAIL_CLIENT_SECRET_FILE")
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

    # Initialize Flask-Talisman only in development
    if os.getenv('FLASK_ENV') == 'development':
        print("Initializing Talisman for development")
        Talisman(app)
    else:
        print("Not initializing Talisman for production")

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

    return app

if __name__ == "__main__":
    app = create_app()
    if os.getenv('FLASK_ENV') == 'development':
        app.run(ssl_context=('path/to/cert.pem', 'path/to/key.pem'), debug=True)
    else:
        app.run(debug=True)